const { SlashCommandBuilder } = require("discord.js");
const { praises } = require("../praises.json");
const DataAccessFactory = require("../database/data-access-factory.js");
const { database } = require("../../client.js");

const randomPraiseMessage = () => {
    return praises[Math.floor(Math.random() * praises.length)];
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("praise")
        .setDescription("Praise Lord Vegito with a message"),
    async execute(interaction) {
        const user = await DataAccessFactory.getUser(database);
        const property = "PraiseCount";
        let value = {count: 0};

        try {
            value = await user.select(interaction.user.id, property);
        } catch (error) {
            console.log(error);
            await user.create(interaction.user.id, property, value);
        }

        ++value.count;
        await user.update(interaction.user.id, property, value);
        await interaction.reply(`<@${interaction.user.id}> praises Vegito with the following message:\n\n *${randomPraiseMessage()}*`);
    },
};
