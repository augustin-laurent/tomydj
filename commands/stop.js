const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "stop",
    description: "Stop la musique joué et supprime la file d'attente",
    usage: "",
    aliases: [],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("Vous devez être dans un canal vocal pour éxecuter cette commande !", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("Aucune musique n'est actuellement joué, impossible donc de la stopper.", message.channel);
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Musique arrêté.");
    message.react("✅")
  },
};
