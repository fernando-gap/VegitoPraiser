const { SlashCommandBuilder, EmbedBuilder, bold } = require("discord.js");
const DataAccessFactory = require("../database/data-access-factory.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Check out your profile status as a fellow Vegito praiser."),
    async execute(interaction) {
        const user = await DataAccessFactory.getProperty(interaction.db);
        const value = await user.select(interaction.user.id, "praise_count");
        console.log(interaction.user.displayAvatarURL());
        const embed = new EmbedBuilder()
            .setColor(0x0047AB)
            .setDescription(
                bold(`<@${interaction.user.id}> Statistics\n\n`)
                + "Total Praises: " + value.praise_count.toString() + "\n"
                + "Praiser Points: " +value.praise_count.toString()
            )
            .setThumbnail(interaction.user.displayAvatarURL());

        await interaction.reply({
            embeds: [embed]
        });
    },
};