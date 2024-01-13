import { SlashCommandBuilder, EmbedBuilder, userMention } from "discord.js";
import { DataAccessFactory } from "../database/data-access-factory.js";
import { oneLine } from "common-tags";

export const data = new SlashCommandBuilder()
    .setName("notify")
    .addStringOption(option => option
        .setName("type")
        .setDescription(oneLine`
            Choose if you want to get 
            notifications daily or hourly.
        `).addChoices(
            { name: "daily", value: "daily" },
            { name: "hourly", value: "hourly" }
        )
        .setRequired(true))
    .addBooleanOption(option => option
        .setName("enable")
        .setDescription("Enable/Disable hourly or daily reminder to praise.")
        .setRequired(true)
    )
    .setDescription("Get notified daily or hourly to praise Vegito.");
export async function execute(interaction) {
    const notifyType = interaction.options.getString("type");
    const isEnabled = interaction.options.getBoolean("enable");
    const embed = new EmbedBuilder()
        .setColor(interaction.bot.config.colors.apricot);

    const id = interaction.user.id;
    const userDAO = await DataAccessFactory.getUser();
    const user = await userDAO.select(id);

    const numberType = notifyType === "hourly"
        ? `<t:${Math.round((Date.now() + 3600 * 1000) / 1000)}:R>`
        : `<t:${Math.round((Date.now() + 24 * 60 * 60 * 1000) / 1000)}:R>`;


    if (notifyType === "hourly") {
        if (isEnabled) {
            let content = "";
            if (user.has_hourly_reminder) {
                embed.setDescription("Your reminder was already active.\n");
                content = oneLine`
                    ${userMention(id)} remember: 
                    your reminder is updated after praise!
                `;

                await interaction.reply({ content: content, embeds: [embed] });
            } else {
                embed.setDescription(oneLine`
                    ${numberType} you'll get pinged to praise Vegito!!!`
                );

                content = `<@${id}> You enabled hourly notifications!`;
                await interaction.reply({ content: content, embeds: [embed] });

                await userDAO.update(id, "has_hourly_reminder", true);
                await userDAO.update(id, "has_daily_reminder", false);

                await interaction.bot.scheduler.create(
                    "hourly_reminder_praise", 
                    {
                        user_id: id,
                        channel_id: interaction.channel.id
                    }
                );
            }
        } else {
            let content = "";
            if (!user.has_hourly_reminder) {
                const { notify } = interaction.bot.config.commands;
                content = oneLine`
                    ${userMention(id)} You have no hourly 
                    reminders currently active!
                `;

                embed.setDescription(oneLine`
                    Use </${notify.name}:${notify.id}> 
                    to enable hourly notifications.
                `);

            } else {
                content = oneLine`
                    ${userMention(id)} 
                    You disabled hourly notifications!
                `;

                embed.setDescription(oneLine`
                    Vegito is still with you! 
                    You will no longer receive reminders.
                `);

                await interaction.bot.scheduler.delete(
                    "hourly_reminder_praise", 
                    { 
                        user_id: id 
                    }
                );

                await userDAO.update(id, "has_hourly_reminder", false);
            }

            await interaction.reply({ content: content, embeds: [embed] });
        }

    } else if (notifyType === "daily") {
        if (isEnabled) {
            let content = "";
            if (user.has_daily_reminder) {
                embed.setDescription(oneLine`
                    Your reminder is now updated and active.`
                );

                content = `${userMention(id)} Your reminder was already set!`;
                await interaction.bot.scheduler.reschedule(
                    "daily_reminder_praise", 
                    {
                        user_id: id,
                        channel_id: interaction.channel.id
                    }
                );

                await interaction.reply({ content: content, embeds: [embed] });
            } else {
                embed.setDescription(oneLine`
                    ${numberType} you'll get pinged to praise Vegito!!!`
                );

                content = `${userMention(id)} You enabled daily notifications!`;
                await interaction.reply({ content: content, embeds: [embed] });
                await userDAO.update(id, "has_daily_reminder", true);
                await userDAO.update(id, "has_hourly_reminder", false);
                await interaction.bot.scheduler.create(
                    "daily_reminder_praise",
                    {
                        user_id: id,
                        channel_id: interaction.channel.id
                    }
                );
            }
        } else {
            let content = "";
            if (!user.has_daily_reminder) {
                const { notify } = interaction.bot.config.commands;
                content = oneLine`
                    ${userMention(id)} 
                    You have no daily reminders currently active!
                `;

                embed.setDescription(oneLine`
                    Use </${notify.name}:${notify.id}> 
                    to enable daily notifications.
                `);

            } else {
                content = oneLine`
                    ${userMention(id)} 
                    You disabled daily notifications!
                `;

                embed.setDescription(oneLine`
                    Vegito is still with you! 
                    You will no longer receive reminders.
                `);

                await interaction.bot.scheduler.delete(
                    "daily_reminder_praise", 
                    { 
                        user_id: id 
                    }
                );
                await userDAO.update(id, "has_daily_reminder", false);
            }
            await interaction.reply({ content: content, embeds: [embed] });
        }
    }
}
