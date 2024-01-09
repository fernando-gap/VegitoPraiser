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
        const embed = new EmbedBuilder()
            .setColor(interaction.bot.config.colors.cerulean)
            .setDescription(italic(randomPraiseMessage()));

        await interaction.reply({
            content: italic(bold(`<@${interaction.user.id}> praises Vegito:`)),
            embeds: [embed]
        });

        const userPropertyDAO = await DataAccessFactory.getProperty(interaction.db);
        const userDAO = await DataAccessFactory.getUser(interaction.db);
        await userPropertyDAO.updatePraiserCount(interaction.user.id);

        const user = await userDAO.select(interaction.user.id);

        if (user.has_hourly_reminder) {
            await interaction.scheduler.reschedule("hourly_reminder_praise", { 
                user_id: interaction.user.id,
                channel_id: interaction.channel.id
            });
        }
    },
};
