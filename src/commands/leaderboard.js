import { SlashCommandBuilder, EmbedBuilder, bold, userMention } from "discord.js";
import { DataAccessFactory } from "../database/data-access-factory.js";
import { stripIndents } from "common-tags";

export const data = new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Find the Top Vegito Praisers and your own rank.");

export async function execute(interaction) {
    const embed = new EmbedBuilder()
        .setColor(interaction.bot.config.colors.apricot)
        .setTitle("Praise Leaderboard");

    const prop = await DataAccessFactory.getProperty();
    const rank = await prop.selectAll();

    const c = rank.splice(0, 3).map(v => ({
        id: v.user_id, 
        count: v.praise_count}
    ));

    const str = stripIndents`
        :first_place: ${userMention(c[0].id)} ${bold(c[0].count)}
        :second_place: ${userMention(c[1].id)} ${bold(c[1].count)}
        :third_place: ${userMention(c[2].id)} ${bold(c[2].count)}
    `;

    embed.setDescription(str);
    await interaction.reply({
        embeds: [embed]
    });
}