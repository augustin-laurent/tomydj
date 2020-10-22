const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "play",
    description: "Pour faire jouer une musique",
    usage: "<song_name>",
    aliases: ["p"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("Vous devez être dans un canal vocal pour éxecuter cette commande !", message.channel);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))return sendError("Je ne peux pas me connecter dans votre canal vocal, je n'ai surêment pas la permission !", message.channel);
    if (!permissions.has("SPEAK"))return sendError("Je ne peux pas parler dans votre canal vocal, je n'ai surêment pas la permission !", message.channel);

    var searchString = args.join(" ");
    if (!searchString)return sendError("Vous n'avez rien donné à jouer", message.channel);

    var serverQueue = message.client.queue.get(message.guild.id);

    var searched = await yts.search(searchString)
    if(searched.videos.length === 0)return sendError("Cette musique ne semble pas disponible sur YouTube", message.channel)
    var songInfo = searched.videos[0]

    const song = {
      id: songInfo.videoId,
      title: Util.escapeMarkdown(songInfo.title),
      views: String(songInfo.views).padStart(10, ' '),
      url: songInfo.url,
      ago: songInfo.ago,
      duration: songInfo.duration.toString(),
      img: songInfo.image,
      req: message.author
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      let thing = new MessageEmbed()
      .setAuthor("La musique a été ajouté à la file d'attente", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(song.img)
      .setColor("YELLOW")
      .addField("Nom", song.title, true)
      .addField("Durée", song.duration, true)
      .addField("Demandé par", song.req.tag, true)
      .setFooter(`Vue: ${song.views} | ${song.ago}`)
      return message.channel.send(thing);
    }

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 2,
      playing: true,
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async (song) => {
      const queue = message.client.queue.get(message.guild.id);
      if (!song) {
        sendError("J'ai quitté votre canal vocal car plus aucune musique n'était disponible dans votre file d'attente", message.channel)
        queue.voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
        return;
      }

      const dispatcher = queue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          queue.songs.shift();
          play(queue.songs[0]);
        })
        .on("error", (error) => console.error(error));
      dispatcher.setVolumeLogarithmic(queue.volume / 5);
      let thing = new MessageEmbed()
      .setAuthor("La musique commence !", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Nom", song.title, true)
      .addField("Durée", song.duration, true)
      .addField("Demandé par", song.req.tag, true)
      .setFooter(`Vue: ${song.views} | ${song.ago}`)
      queue.textChannel.send(thing);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      channel.guild.voice.setSelfDeaf(true)
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Je n'ai pas pu rejoindre le canal vocal : ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return sendError(`Je n'ai pas pu rejoindre le canal vocal : ${error}`, message.channel);
    }
  }
};