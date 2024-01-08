const { SlashCommandBuilder, EmbedBuilder, bold } = require("discord.js");
const DataAccessFactory = require("../database/data-access-factory.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Check out your profile status as a fellow Vegito praiser."),
    async execute(interaction) {
        const user = await DataAccessFactory.getProperty(interaction.db);
        const value = await user.select(interaction.user.id, "praise_count");
        const embed = new EmbedBuilder()
            .setColor(interaction.bot.config.colors.cerulean)
            .setDescription(
                bold(`<@${interaction.user.id}> Statistics\n\n`)
                + "Total Praises: " + value.praise_count.toString() + "\n"
                + value.praise_count.toString() + "<:potaraearrings:1193378255407951982>"
            )
            .setThumbnail(interaction.user.displayAvatarURL());

        await interaction.reply({
            embeds: [embed]
        });
    },
};