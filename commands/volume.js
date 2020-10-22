const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "volume",
    description: "Ajuste le volume à laquelle les musiques sont jouée",
    usage: "[volume]",
    aliases: ["v", "vol"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("Vous devez être dans un canal vocal pour éxecuter cette commande !", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Aucune musique n'est actuellement joué sur le serveur", message.channel);
    if (!args[0])return message.channel.send(`Le volume actuel est: **${serverQueue.volume}**`);
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    let xd = new MessageEmbed()
    .setDescription(`J'ai ajusté le volume à : **${args[0]/5}/5**`)
    .setAuthor("Gestion du volume", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
    .setColor("BLUE")
    return message.channel.send(xd);
  },
};
