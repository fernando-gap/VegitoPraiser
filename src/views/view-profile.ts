import { stripIndents } from "common-tags";
import { EmbedBuilder, bold, userMention } from "discord.js";

import { Color, Emoji } from "../enums.js";
import { ContextProfile, Reply, View } from "../interfaces.js";

export class ViewProfile implements View {
  frontend(context: ContextProfile): Reply {
    const description = stripIndents`
            ${bold(`${userMention(context.userId)} Profile\n`)}
            Total Praises: ${context.currentPraiseCount}
            Potara Coins: ${context.currentPotaraCoins} ${Emoji.POTARA_EARRINGS}
        `;

    return {
      embeds: [
        new EmbedBuilder()
          .setColor(Color.CERULEAN)
          .setDescription(description)
          .setThumbnail(context.avatarURL),
      ],
    };
  }
}
