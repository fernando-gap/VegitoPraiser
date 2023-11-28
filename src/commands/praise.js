const { SlashCommandBuilder, EmbedBuilder, italic, bold } = require("discord.js");
const { praises } = require("../config/praises.json");
const DataAccessFactory = require("../database/data-access-factory.js");

const randomPraiseMessage = () => {
    return praises[Math.floor(Math.random() * praises.length)];
};

module.exports = {
    cooldown: 60 * 60,
    data: new SlashCommandBuilder()
        .setName("praise")
        .setDescription("Praise Lord Vegito with a message."),
    async execute(interaction) {
        const user = await DataAccessFactory.getProperty(interaction.db);
        await user.updatePraiserCount(interaction.user.id);
        const embed = new EmbedBuilder()
            .setColor(interaction.bot.config.colors.cerulean)
            .setDescription(italic(randomPraiseMessage()));

        await interaction.reply({
            content: italic(bold(`<@${interaction.user.id}> praises Vegito:`)),
            embeds: [embed]
        });
    },
};
