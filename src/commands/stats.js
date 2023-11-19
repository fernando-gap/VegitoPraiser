const { SlashCommandBuilder } = require("discord.js");
const DataAccessFactory = require("../database/data-access-factory.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Check out your profile status as a fellow Vegito praiser"),
    async execute(interaction) {
        const user = await DataAccessFactory.getProperty(interaction.db);
        const value = await user.select(interaction.user.id, "praise_count");
        interaction.reply(`<@${interaction.user.id}> has a total of **${value.praise_count}** praises.\n\n *"Stay strong and push forward, channeling the indomitable spirit of Vegito within you!"*`);
    },
};