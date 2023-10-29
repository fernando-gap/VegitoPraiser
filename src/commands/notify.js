const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("notify")
        .setDescription("Get notified once a day to praise Vegito"),
    async execute(interaction) {
        await interaction.reply("Worker *Nandoka* is currently implementing it while battling alongside Vegito through galaxies");
    },
    test: true
};

