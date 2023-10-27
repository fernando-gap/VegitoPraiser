const { SlashCommandBuilder } = require("discord.js");
const DatabaseFactory = require("../database/database-factory.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Check out your profile status as a fellow Vegito praiser"),
    async execute(interaction) {
        const db = await DatabaseFactory.getUser();
        const property = "PraiseCount";
        let value = {count: 0};

        try {
            value = await db.select(interaction.user.id, property);
        } catch (error) {
            await db.create(interaction.user.id, property, value);
        }

        interaction.reply(`<@${interaction.user.id}> has a total of **${value.count}** praises.\n\n *"Stay strong and push forward, channeling the indomitable spirit of Vegito within you!"*`);
    },
};