import { EmbedBuilder, bold, userMention } from "discord.js";
import { stripIndents } from "common-tags";

import { ContextProfile, View } from "../interfaces.js";
import { Color, Emoji } from "../enums.js";
import { Reply } from "../types.js";

export class ViewProfile implements View {
    frontend(context: ContextProfile): Reply {
        const description = stripIndents`
            ${bold(`${userMention(context.userId)} Statistics\n`)}
            Total Praises: ${context.currentPraiseCount}
            Potara Coins: ${context.currentPotaraCoins} ${Emoji.POTARA_EARRINGS}
        `

        return {
            embeds: [
                new EmbedBuilder()
                    .setColor(Color.CERULEAN)
                    .setDescription(description)
                    .setThumbnail(context.avatarURL)
            ]
        }

    }
}