const sendError = require("../util/error");

module.exports = {
  info: {
    name: "skip",
    description: "Passe la musique actuellement joué",
    usage: "",
    aliases: ["s"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("Vous devez être dans un canal vocal pour éxecuter cette commande !", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("Aucune musique n'est actuellement joué, impossible donc d'en passer une.", message.channel);
    serverQueue.connection.dispatcher.end("Musique passé");
    message.react("✅")
  },
};
