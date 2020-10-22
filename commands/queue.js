const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "queue",
    description: "Affiche la list d'attente",
    usage: "",
    aliases: ["q", "list", "songlist", "song-list"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Aucune musique n'est actuellement joué sur le serveur.", message.channel);

    let queue = new MessageEmbed()
    .setAuthor("File d'attente", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
    .setColor("BLUE")
    .addField("Joue maintenant", serverQueue.songs[0].title, true)
    .addField("Canal textuel", serverQueue.textChannel, true)
    .addField("Canal vocal", serverQueue.voiceChannel, true)
    .setDescription(serverQueue.songs.map((song) => {
      if(song === serverQueue.songs[0])return
      return `**-** ${song.title}`
    }).join("\n"))
    .setFooter("Le volume actuel est "+serverQueue.volume)
    if(serverQueue.songs.length === 1)queue.setDescription(`Aucune musique n'est dans la file après celle joué actuellement, ajouté en une avec \`\`${client.config.prefix}play <song_name>\`\``)
    message.channel.send(queue)
  },
};
