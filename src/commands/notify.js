const { SlashCommandBuilder, EmbedBuilder, bold, italic } = require("discord.js");
const DataAccessFactory = require("../database/data-access-factory");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("notify")
        .addBooleanOption(option => option
            .setName("enable")
            .setDescription("Enable/Disable notification to praise.")
            .setRequired(true))
        .setDescription("Get notified once a day to praise Vegito."),

    async execute(interaction) {
        const isEnabled = interaction.options.getBoolean("enable");
        const embed = new EmbedBuilder().setColor(0x0047AB);
        const str = `<@${interaction.user.id}> You have just ${isEnabled ? bold("enabled") : bold("disabled")} the notification system.`;
        let strEnd = "";


        const schedule = await DataAccessFactory.getSchedule(interaction.db);

        if (isEnabled) {
            strEnd = "\n\nIn 24 hours, you will be remembered for praising Lord and Savior Vegito once again!!\n";
            const update = await schedule.update(interaction.user.id, interaction.channel.id);
            if (update[0] === 0) {
                await schedule.create(interaction.user.id, interaction.channel.id);
            } else {
                strEnd = "\n\nYour scheduled reminder was just updated to the next 24 hours.";
            }
        } else {
            await schedule.delete(interaction.user.id);
        }


        embed.setDescription(strEnd ? str + italic(strEnd) : str);

        await interaction.reply({
            embeds: [embed]
        });
    }
};

