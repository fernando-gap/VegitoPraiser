const { SlashCommandBuilder } = require("discord.js");
const { praises } = require("../praises.json");
const DataAccessFactory = require("../database/data-access-factory.js");

const randomPraiseMessage = () => {
    return praises[Math.floor(Math.random() * praises.length)];
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("praise")
        .setDescription("Praise Lord Vegito with a message"),
    async execute(interaction) {
        const property = "PraiseCount";
        const user = await DataAccessFactory.getUser(interaction.db);
        const value = await user.select(interaction.user.id, property);
        ++value.count;

        await user.update(interaction.user.id, property, value);
        await interaction.reply(`<@${interaction.user.id}> praises Vegito with the following message:\n\n *${randomPraiseMessage()}*`);
    },
};
