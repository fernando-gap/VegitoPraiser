import { oneLine } from "common-tags";
import { EmbedBuilder, bold, userMention } from "discord.js";
import { Color } from "../enums.js";
import { Context, Reply, View } from "../interfaces.js";

export default class ViewJobNotifyDailyPraise implements View {
  frontend(context: Context): Reply {
    const praise = "</praise:1246506143669424182>";

    return {
      content: oneLine`
                    ${userMention(context.userId)} ${bold("daily")} 
                    reminder is here, let your praise resound!
                `,
      embeds: [
        new EmbedBuilder().setColor(Color.CERULEAN).setDescription(oneLine`
                            Use ${praise} to unleash the power of Vegito, 
                            uniting us in celestial devotion.
                    `),
      ],
    };
  }
}
