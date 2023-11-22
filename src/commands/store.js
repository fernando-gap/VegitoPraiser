const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("store")
        .setDescription("Buy items with Vegito Praiser Points (PP)"),
    async execute(interaction) {
        await interaction.reply("Worker nandoka is currently implementing it.");
    },
    test: true
};