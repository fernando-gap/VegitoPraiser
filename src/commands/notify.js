const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const DataAccessFactory = require("../database/data-access-factory");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("notify")
        .addStringOption(option => option
            .setName("type")
            .setDescription("Choose if you want to get notifications daily or hourly.")
            .addChoices(
                { name: "daily", value: "daily"},
                { name: "hourly", value: "hourly"}
            )
            .setRequired(true))
        .addBooleanOption(option => option
            .setName("enable")
            .setDescription("Enable/Disable hourly or daily reminder to praise.")
            .setRequired(true)
        )
        .setDescription("Get notified daily or hourly to praise Vegito."),

    async execute(interaction) {
        const notifyType = interaction.options.getString("type");
        const isEnabled = interaction.options.getBoolean("enable");
        const embed = new EmbedBuilder().setColor(interaction.bot.config.colors.apricot);
        const userDAO = await DataAccessFactory.getUser(interaction.db);
        const user = await userDAO.select(interaction.user.id);

        const numberType = notifyType === "hourly" 
            ? `<t:${Math.round((Date.now() + 3600 * 1000)/1000)}:R>`
            : `<t:${Math.round((Date.now() + 24 * 60 * 60 * 1000)/1000)}:R>`;

        console.log("TYPE,", notifyType);
        if (notifyType === "hourly") {
            if (isEnabled) {
                let content = "";
                if (user.has_hourly_reminder) {
                    embed.setDescription("Your reminder was already active.\n");
                    content =`<@${interaction.user.id}> remember: your reminder is updated after praise!`; 
                    await interaction.reply({ content: content, embeds: [embed] });
                } else {
                    embed.setDescription(`${numberType} you'll get pinged to praise Vegito!!!\n`);
                    content = `<@${interaction.user.id}> You enabled hourly notifications!`;
                    await interaction.reply({ content: content, embeds: [embed] });

                    await userDAO.update(interaction.user.id, "has_hourly_reminder", true);
                    await userDAO.update(interaction.user.id, "has_daily_reminder", false);

                    await interaction.scheduler.create("hourly_reminder_praise", {
                        user_id: interaction.user.id, 
                        channel_id: interaction.channel.id 
                    });
                }
            } else {
                let content = "";
                if (!user.has_hourly_reminder) {
                    const { notify } = interaction.bot.config.commands;
                    content = `<@${interaction.user.id}> You have no hourly reminders currently active!`;
                    embed.setDescription(`Use </${notify.name}:${notify.id}> to enable hourly notifications.`);
                } else {
                    content = `<@${interaction.user.id}> You disabled hourly notifications!`;
                    embed.setDescription("Vegito is still with you! You will no longer receive reminders.\n");
                    await interaction.scheduler.delete("hourly_reminder_praise", { user_id: interaction.user.id });
                    await userDAO.update(interaction.user.id, "has_hourly_reminder", false);
                }

                await interaction.reply({ content: content, embeds: [embed] });
            }

        } else if (notifyType === "daily") {
            if (isEnabled) {
                let content = "";
                if (user.has_daily_reminder) {
                    embed.setDescription("Your reminder is now updated and active.\n");
                    content =`<@${interaction.user.id}> Your reminder was already set!`; 
                    await interaction.scheduler.reschedule("daily_reminder_praise", {
                        user_id: interaction.user.id, 
                        channel_id: interaction.channel.id
                    });

                    await interaction.reply({ content: content, embeds: [embed] });
                } else {
                    embed.setDescription(`${numberType} you'll get pinged to praise Vegito!!!\n`);
                    content = `<@${interaction.user.id}> You enabled daily notifications!`;

                    await interaction.reply({ content: content, embeds: [embed] });

                    await userDAO.update(interaction.user.id, "has_daily_reminder", true);
                    await userDAO.update(interaction.user.id, "has_hourly_reminder", false);

                    await interaction.scheduler.create("daily_reminder_praise", {
                        user_id: interaction.user.id, 
                        channel_id: interaction.channel.id 
                    });
                } 
                
            } else {
                let content = "";
                if (!user.has_daily_reminder) {
                    const { notify } = interaction.bot.config.commands;
                    content = `<@${interaction.user.id}> You have no daily reminders currently active!`;
                    embed.setDescription(`Use </${notify.name}:${notify.id}> to enable daily notifications.`);
                } else {
                    content = `<@${interaction.user.id}> You disabled daily notifications!`;
                    embed.setDescription("Vegito is still with you! You will no longer receive reminders.\n");
                    await interaction.scheduler.delete("daily_reminder_praise", { user_id: interaction.user.id });
                    await userDAO.update(interaction.user.id, "has_daily_reminder", false);
                }

                await interaction.reply({ content: content, embeds: [embed] });
            }
        }
    }
};

