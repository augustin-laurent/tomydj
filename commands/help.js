const { MessageEmbed } = require('discord.js')

module.exports = {
    info: {
        name: "help",
        description: "Pour voir toutes les commandes",
        usage: "[command]",
        aliases: ["commandes", "aide"]
    },

    run: async function(client, message, args){
        var allcmds = "";

        client.commands.forEach(cmd => {
            let cmdinfo = cmd.info
            allcmds+="``"+client.config.prefix+cmdinfo.name+" "+cmdinfo.usage+"`` ~ "+cmdinfo.description+"\n"
        })

        let embed = new MessageEmbed()
        .setAuthor("Commandes de "+client.user.username, "/assets/Music.gif")
        .setColor("BLUE")
        .setDescription(allcmds)
        .setFooter(`Pour avoir les informations d'une commande spécifique : ${client.config.prefix}help [command]`)

        if(!args[0])return message.channel.send(embed)
        else {
            let cmd = args[0]
            let command = client.commands.get(cmd)
            if(!command)command = client.commands.find(x => x.info.aliases.includes(cmd))
            if(!command)return message.channel.send("Commande inconnue")
            let commandinfo = new MessageEmbed()
            .setTitle("Commande: "+command.info.name+" info")
            .setColor("YELLOW")
            .setDescription(`
                Nom: ${command.info.name}
                Description: ${command.info.description}
                Utilisation: \`\`${client.config.prefix}${command.info.name} ${command.info.usage}\`\`
                Alias: ${command.info.aliases.join(", ")}
            `)
            message.channel.send(commandinfo)
        }
    }
}
