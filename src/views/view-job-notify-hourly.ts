import { oneLine } from "common-tags";
import { Color } from "../enums.js";
import { Context, View } from "../interfaces.js";
import { Reply } from "../interfaces.js";
import { EmbedBuilder, bold, userMention } from "discord.js";

export default class ViewJobNotifyHourlyPraise implements View {

    frontend(context: Context): Reply {
        const praise = "</praise:1246506143669424182>"

        return {
            content: oneLine`
                    ${userMention(context.userId)} ${bold("hourly")} 
                    reminder is here, let your praise resound!
                `,
            embeds: [
                new EmbedBuilder()
                    .setColor(Color.CERULEAN)
                    .setDescription(oneLine`
                            Use ${praise} to unleash the power of Vegito, 
                            uniting us in celestial devotion.
                    `)
            ]
        }
    }

}