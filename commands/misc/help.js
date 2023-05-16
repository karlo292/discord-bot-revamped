const {
    EmbedBuilder
} = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Info about all commands',
    execute(message, args) {



        // inside a command, event listener, etc.
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Bot Help')
            .addFields({
                name: 'FUN',
                value: '`rng <min> <max>` chooses random number between 2 given \n',
            })
            .addFields({
                name: 'MODERATION',
                value: '`ban <user> <reason>` bans specified user \n`unban <user> <reason>` unbans specified user'
            })
            .addFields({
                name: 'MISC',
                value: '`help` does this\n'
            })
            .setTimestamp()
            .setFooter({
                text: 'Made by karlito1501#0179',
            });

        message.channel.send({
            embeds: [exampleEmbed]
        });


    }

}