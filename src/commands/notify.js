const { SlashCommandBuilder } = require("discord.js");
const DataAccessFactory = require("../database/data-access-factory");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("notify")
        .addBooleanOption(option => option
            .setName("enable")
            .setDescription("Enable/Disable notification to praise")
            .setRequired(true))
        .setDescription("Get notified once a day to praise Vegito"),

    async execute(interaction) {
        const isEnabled = interaction.options.getBoolean("enable");

        await interaction.reply(`<@${interaction.user.id}> *In the name of Vegito, the fusion that brought us the strongest warrior in the universe! Let his example inspire us to achieve greatness and overcome any obstacle in our path.*\n\nYou have just **${isEnabled ? "enabled" : "disabled"}** the notification system. ${isEnabled ? "In 24 hours, you will be remembered for praising Lord and Savior Vegito once again!!" : ""}`);

        const schedule = await DataAccessFactory.getSchedule(interaction.db);

        if (isEnabled) {
            const update = await schedule.update(interaction.user.id, interaction.channel.id);
            if (update[0] === 0) {
                await schedule.create(interaction.user.id, interaction.channel.id);
            }
        } else {
            await schedule.delete(interaction.user.id);
        }

    }
};

