import { EmbedBuilder, bold, italic, userMention } from "discord.js";
import { ContextNotifyHourly, View } from "../interfaces.js";
import { Reply } from "../types.js";
import { Color } from "../enums.js";
import { oneLine } from "common-tags";

export default class ViewNotifyHourly implements View {
    frontend(context: ContextNotifyHourly): Reply {
        if (context.alreadyEnabled) {
            return {
                content: `Did you mean to turn it ${italic("off")}, ${userMention(context.userId)}? `,
                embeds: [
                    new EmbedBuilder()
                        .setColor(Color.INDIAN_RED)
                        .setDescription(`Hourly reminder is already ${bold("active")}.`)
                ]
            }
        }

        if (context.alreadyDisabled) {
            return {
                content: `Did you mean to turn it ${italic("on")}, ${userMention(context.userId)}? `,
                embeds: [
                    new EmbedBuilder()
                        .setColor(Color.INDIAN_RED)
                        .setDescription(`Hourly reminder is already ${bold("disabled")}.`)
                ]
            }
        }

        if (context.enable) {
            const nextPraiseTime = `<t:${Math.round((Date.now() + 3600 * 1000) / 1000)}:R>`;
            return {
                content: `${userMention(context.userId)} enabled hourly notifications!`,
                embeds: [
                    new EmbedBuilder()
                        .setColor(Color.MINT)
                        .setDescription(`First reminder is ${nextPraiseTime} and it is rescheduled at the moment of praise!`)
                ]
            }

        } else {
            return {
                embeds: [
                    new EmbedBuilder()
                        .setColor(Color.APRICOT)
                        .setDescription(oneLine`
                            ${userMention(context.userId)},
                            hourly reminders will no longer bother you
                        `)
                ]
            }
        }
    }
}