const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const embedHelp = new EmbedBuilder()
    .setColor(0x0047AB)
    .setTitle("Vegito Praiser /help");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("General guidance and commands overview."),
    async execute(interaction) {
        const commands = await interaction.client.application.commands.fetch();
        let str = "Command guide for using VegitoPraiser Bot.\n\n";

        commands.forEach(element => {
            str += `</${element.name}:${element.id}> ${element.description}\n`;
        });

        embedHelp.setDescription(str);
        await interaction.reply({ 
            embeds: [embedHelp]
        });
    }
};
