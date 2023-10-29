const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("General guidance and commands overview."),
    async execute(interaction) {
        await interaction.reply("Worker *Nandoka* is currently implementing it while battling alongside Vegito through galaxies");
    },
    test: true
};
