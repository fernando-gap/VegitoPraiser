const { SlashCommandBuilder } = require("discord.js");
const { praises } = require("../praises.json");
const DatabaseFactory = require("../database/database-factory.js");

const randomPraiseMessage = () => {
    return praises[Math.floor(Math.random() * praises.length)];
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("praise")
        .setDescription("Praise Lord Vegito with a message"),
    async execute(interaction) {
        const db = await DatabaseFactory.getUser();
        const property = "PraiseCount";
        let value = {count: 0};

        try {
            value = await db.select(interaction.user.id, property);
        } catch (error) {
            await db.create(interaction.user.id, property, value);
        }

        ++value.count;
        await db.update(interaction.user.id, property, value);
        await interaction.reply(`<@${interaction.user.id}> praises Vegito with the following message:\n\n *${randomPraiseMessage()}*`);
    },
};
