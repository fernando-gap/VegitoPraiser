const { SlashCommandBuilder, EmbedBuilder, bold } = require("discord.js");
const DataAccessFactory = require("../database/data-access-factory");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Find the Top Vegito Praisers and your own rank."),
    async execute(interaction) {
        let str = "";
        const embed = new EmbedBuilder()
            .setColor(0x0047AB)
            .setTitle("Praise Leaderboard");

        const prop = await DataAccessFactory.getProperty(interaction.db);
        const rank = await prop.selectAll();

        str += `:first_place: <@${rank[0].user_id}> ${bold(rank[0].praise_count)}\n`;
        str += `:second_place: <@${rank[1].user_id}> ${bold(rank[1].praise_count)}\n`;
        str += `:third_place: <@${rank[2].user_id}> ${bold(rank[2].praise_count)}\n`;

        /* todo: str += `Your current rank is ${rank_number} with ${praise_number} praises.` */
        embed.setDescription(str);

        await interaction.reply({
            embeds: [embed]
        });
    }
};