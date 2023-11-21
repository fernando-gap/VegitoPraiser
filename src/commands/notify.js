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
        await interaction.reply("Worker *Nandoka* is currently implementing it while battling alongside Vegito through galaxies");

        const schedule = await DataAccessFactory.getSchedule(interaction.db);
        const isEnabled = interaction.options.getBoolean("enable");

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

