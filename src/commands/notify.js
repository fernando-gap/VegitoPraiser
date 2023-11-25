const { SlashCommandBuilder, EmbedBuilder, bold, italic } = require("discord.js");
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
        .setDescription("Get notified once a day to praise Vegito."),

    async execute(interaction) {
        const notifyType = interaction.options.getString("type");
        const numberType = notifyType === "hourly" 
            ? `<t:${Math.round((Date.now() + 3600 * 1000)/1000)}:R>`
            : `<t:${Math.round((Date.now() + 24 * 60 * 60 * 1000)/1000)}:R>`;
        const isEnabled = interaction.options.getBoolean("enable");
        const embed = new EmbedBuilder().setColor(0x0047AB);
        const schedule = await DataAccessFactory.getSchedule(interaction.db);
        let str = `<@${interaction.user.id}> You ${isEnabled ? bold("enabled") : bold("disabled")} ${bold(notifyType)} notifications!`;
        let strEnd = `\n\n${numberType} you'll get pinged to praise Vegito!!!\n`;

        const scheduleUser = await schedule.select(interaction.user.id);

        if (scheduleUser === null) {
            schedule.createManually();
            schedule.addManually("channel_id", interaction.channel.id);
            schedule.addManually("user_id", interaction.user.id);

            if (isEnabled) {
                if (notifyType === "hourly") schedule.addManually("has_hourly_reminder", true);
                await schedule.saveManually();
            } else {
                str = `<@${interaction.user.id}> You do ${bold("not")} have ${bold(notifyType)} notifications to disable.`;
                strEnd = "\n\nThat Vegito's power stays with you!";
            }
        } else {
            str = `\n\n<@${interaction.user.id}> Your ${bold(notifyType)} reminder is now updated and active!`;

            if (notifyType === "daily" && isEnabled) {
                if (scheduleUser.has_hourly_reminder) {
                    str = "Your hourly reminder will be **turned off**.\n" + str;
                    await schedule.update(interaction.user.id, {
                        channel_id: interaction.channel.id,
                        has_hourly_reminder: false,
                        last_praise: new Date()
                    });
                } else {
                    await schedule.update(interaction.user.id, {
                        channel_id: interaction.channel.id,
                        last_praise: new Date()
                    });
                }

            }

            if (notifyType === "hourly" && isEnabled) {
                if (!scheduleUser.has_hourly_reminder) {
                    str = "Your daily reminder will be **turned off**.\n" + str;
                }

                await schedule.update(interaction.user.id, {
                    channel_id: interaction.channel.id,
                    has_hourly_reminder: true,
                    last_praise: new Date()
                });
            }

            if (!isEnabled) {
                if (notifyType === "hourly" && !scheduleUser.has_hourly_reminder) {
                    str = `<@${interaction.user.id}> You do ${bold("not")} have ${bold(notifyType)} notifications to disable.`;
                    strEnd = "\n\nThat Vegito's power stays with you!";
                } else {
                    str = `\n\n<@${interaction.user.id}> You ${bold("removed")} ${bold(notifyType)} notifications!`;
                    strEnd = "\n\nAs notifications yield, our fervent Vegito praise becomes the beacon that lights our path.";
                    await schedule.delete(interaction.user.id);
                }
            }
        }

        embed.setDescription(strEnd ? str + italic(strEnd) : str);

        await interaction.reply({
            embeds: [embed]
        });
    },
    test: true
};

