const { SlashCommandBuilder } = require("discord.js");
const DataAccessFactory = require("../database/data-access-factory.js");
const { database } = require("../../client.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Check out your profile status as a fellow Vegito praiser"),
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

        interaction.reply(`<@${interaction.user.id}> has a total of **${value.count}** praises.\n\n *"Stay strong and push forward, channeling the indomitable spirit of Vegito within you!"*`);
    },
};