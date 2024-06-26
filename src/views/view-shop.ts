import { oneLineTrim, stripIndents } from "common-tags";
import { bold } from "discord.js";
import { Emoji } from "../enums.js";
import { Reply, View } from "../interfaces.js";
import { ContextShop } from "../types.js";

export default class ViewShop implements View {
  frontend(context: ContextShop): Reply {
    const items = [];

    for (const item of context) {
      const itemHeader = oneLineTrim`
                ${item.emoji}
                (${item.code}) ${item.name}
            `;

      const itemInfo = stripIndents`
                > Description: ${item.description}
                > Price: ${item.price}${Emoji.POTARA_EARRINGS}
            `;

      items.push(stripIndents`
                ${bold(itemHeader)}
                ${itemInfo}
            `);
    }

    console.log(items);

    return {
      content: items.map((item, n) => `**${n + 1}**. ${item}`).join("\n\n"),
    };
  }
}
