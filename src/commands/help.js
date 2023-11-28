const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("General guidance and commands overview."),
    async execute(interaction) {
        const embedHelp = new EmbedBuilder()
            .setColor(interaction.bot.config.colors.cerulean)
            .setTitle("Vegito Praiser /help");

        let str = "Command guide for using VegitoPraiser Bot.\n\n";

        for (const command of Object.values(interaction.bot.config.commands)) {
            const {name, id, description} = command;
            str += `</${name}:${id}> ${description}\n`;
        }

        embedHelp.setDescription(str);
        await interaction.reply({ 
            embeds: [embedHelp]
        });
    }
};
