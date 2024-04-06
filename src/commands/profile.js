import { SlashCommandBuilder, EmbedBuilder, bold, userMention } from "discord.js";
import { DataAccessFactory } from "../database/data-access-factory.js";
import { oneLine, stripIndents } from "common-tags";


export const data = new SlashCommandBuilder()
    .setName("profile")
    .setDescription(oneLine`
        Check out your profile 
        status as a fellow Vegito praiser.`
    );
export async function execute(interaction) {
    const user = await DataAccessFactory.getUser(interaction.bot.db);
    const value = await user.selectOne(
        { id: interaction.user.id }, ["praise_count", "potara_coins"]
    );

    const embed = new EmbedBuilder()
        .setColor(interaction.bot.config.colors.cerulean)
        .setDescription(stripIndents`
            ${bold(`${userMention(interaction.user.id)} Statistics\n`)}
            Total Praises: ${value.dataValues.praise_count}
            ${oneLine`
                Potara Coins: ${value.dataValues.potara_coins}
                ${interaction.bot.config.emojis.potara_coins}`}
            `)
        .setThumbnail(interaction.user.displayAvatarURL());

    await interaction.reply({
        embeds: [embed]
    });
}