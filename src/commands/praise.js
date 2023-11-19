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
        const user = await DataAccessFactory.getProperty(interaction.db);
        await user.updatePraiserCount(interaction.user.id);
        await interaction.reply(`<@${interaction.user.id}> praises Vegito with the following message:\n\n *${randomPraiseMessage()}*`);
    },
};
