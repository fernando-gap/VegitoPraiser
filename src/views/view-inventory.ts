import { EmbedBuilder, bold } from "discord.js";
import { Color } from "../enums.js";
import { ContextInventory, Reply, View } from "../interfaces.js";

export default class ViewInventory implements View {
  frontend(context: ContextInventory): Reply {
    let description = context.items
      .map((item) => `${bold(item.amount + "x")}${item.emoji}`)
      .join(` ${context.delimiter} `);

    if (description.length <= 0) {
      description = "No items.";
    }

    return {
      embeds: [
        new EmbedBuilder()
          .setColor(Color.CERULEAN)
          .setAuthor({
            name: context.name,
            iconURL: context.avatarURL,
          })
          .setDescription(description)
          .setFooter({
            text: "Inventory",
          })
          .setTimestamp(),
      ],
    };
  }
}
