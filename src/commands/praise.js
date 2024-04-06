import { SlashCommandBuilder, EmbedBuilder, italic, bold } from "discord.js";
import praises from "../config/praises.js";
import { DataAccessFactory } from "../database/data-access-factory.js";

const randomPraiseMessage = () => {
    return praises.praises[Math.floor(Math.random() * praises.praises.length)];
};

export const cooldown = 60 * 60;
export const data = new SlashCommandBuilder()
    .setName("praise")
    .setDescription("Praise Lord Vegito with a message.");
export async function execute(interaction) {
    const embed = new EmbedBuilder()
        .setColor(interaction.bot.config.colors.cerulean)
        .setDescription(italic(randomPraiseMessage()));

    await interaction.reply({
        content: italic(bold(`<@${interaction.user.id}> praises Vegito:`)),
        embeds: [embed]
    });

    const userDAO = await DataAccessFactory.getUser(interaction.bot.db);
    userDAO.increment({ id: interaction.user.id }, "praise_count", "potara_coins");
    const user = await userDAO.selectOne({id: interaction.user.id});

    if (user.has_hourly_reminder) {
        await interaction.bot.scheduler.reschedule("hourly_reminder_praise", {
            user_id: interaction.user.id,
            channel_id: interaction.channel.id
        });
    }
}
