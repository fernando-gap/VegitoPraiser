import { EmbedBuilder } from "discord.js";
import { Color } from "../enums.js";
import { Reply, View } from "../interfaces.js";
import { ContextHelp } from "../types.js";

export class ViewHelp implements View {
  frontend(context: ContextHelp): Reply {
    let cmds = "";

    for (const command of Object.values(context)) {
      const { name, id, description } = command;
      cmds += `</${name}:${id}> ${description}\n`;
    }
    return {
      embeds: [
        new EmbedBuilder()
          .setColor(Color.CERULEAN)
          .setTitle("Vegito Praiser /help")
          .setDescription(
            "Command guide for using VegitoPraiser Bot.\n\n" + cmds,
          ),
      ],
    };
  }
}
