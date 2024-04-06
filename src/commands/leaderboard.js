import { SlashCommandBuilder, EmbedBuilder, bold, userMention } from "discord.js";
import { DataAccessFactory } from "../database/data-access-factory.js";
import { stripIndents, oneLine } from "common-tags";

export const data = new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Find the Top Vegito Praisers and your own rank.");

export async function execute(interaction) {
    const embed = new EmbedBuilder()
        .setColor(interaction.bot.config.colors.apricot)
        .setTitle("Praise Leaderboard");

    const prop = await DataAccessFactory.getUser(interaction.bot.db);
    let rank = await prop.selectAll(10, 0, ["praise_count", "DESC"]);

    const c = rank.splice(0, 3).map(v => ({
        id: v.dataValues.id, 
        count: v.dataValues.praise_count}
    ));

    let str = stripIndents`
        :first_place: ${userMention(c[0].id)} ${bold(c[0].count)}
        :second_place: ${userMention(c[1].id)} ${bold(c[1].count)}
        :third_place: ${userMention(c[2].id)} ${bold(c[2].count)}
    `;

    rank = rank.filter((v) => v.praise_count > 0);

    for (let i = 0; i < rank.length; i++) {
        str += "\n" + oneLine`
            ${4+i}. ${userMention(rank[i].user_id)}
            ${bold(rank[i].praise_count)}
        `;
    }

    embed.setDescription(str);
    await interaction.reply({
        embeds: [embed]
    });
}