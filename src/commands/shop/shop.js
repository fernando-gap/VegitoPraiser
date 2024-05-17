import { SlashCommandBuilder, bold } from "discord.js";
import { oneLineTrim, stripIndents } from "common-tags";
import { DataAccessFactory } from "../../database/data-access-factory.js";

export const data = new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Check out shop items.");

const createItems = (items, emojiCoin) => {
    let shopItems = "";

    for (let c = 0; c < items.length; c++) {
        const item_header = oneLineTrim`
            ${c + 1}.
            ${items[c].emoji}
            (${items[c].code}) ${items[c].name} 
        `;

        const item = stripIndents`
            ${bold(item_header)}
            > Description: ${items[c].description}
            > Price: ${items[c].price}${emojiCoin}
        `;

        shopItems += `\n${item}\n`;
    }
    return shopItems;
};

export async function execute(interaction) {
    const shop = await DataAccessFactory.getShop(interaction.bot.db);
    const spoils = await shop.selectAll(50, 0, ["price", "ASC"]);
    const potaraCoinEmoji = interaction.bot.config.emojis.potara_coins;

    await interaction.reply({
        content: createItems(spoils.map(v => v.dataValues), potaraCoinEmoji)
    });
}
