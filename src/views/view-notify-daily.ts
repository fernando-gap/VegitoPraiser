import { oneLine } from "common-tags";
import { userMention, EmbedBuilder, italic, bold } from "discord.js";
import { Color } from "../enums.js";
import { ContextNotifyDaily, View } from "../interfaces.js";
import { Reply } from "../interfaces.js";

export default class ViewNotifyDaily implements View {
    frontend(context: ContextNotifyDaily): Reply {
        if (context.alreadyEnabled) {
            const nextPraiseTime = `<t:${Math.round((Date.now() + 24 * 60 * 60 * 1000) / 1000)}:t>`;
            return {
                content: `${userMention(context.userId)} daily reminder is already active.`,
                embeds: [
                    new EmbedBuilder()
                        .setColor(Color.CERULEAN)
                        .setDescription(`Reminder was updated to run daily at ${nextPraiseTime}`)
                ]
            }
        }

        if (context.alreadyDisabled) {
            return {
                content: `Did you mean to turn it ${italic("on")}, ${userMention(context.userId)}? `,
                embeds: [
                    new EmbedBuilder()
                        .setColor(Color.INDIAN_RED)
                        .setDescription(`Daily reminder is already ${bold("disabled")}.`)
                ]
            }
        }

        if (context.enable) {
            const nextPraiseTime = `<t:${Math.round((Date.now() + 24 * 60 * 60 * 1000) / 1000)}:t>`;
            return {
                content: `${userMention(context.userId)} enabled daily notifications!`,
                embeds: [
                    new EmbedBuilder()
                        .setColor(Color.MINT)
                        .setDescription(`Vegito will reminder you daily at ${nextPraiseTime}!`)
                ]
            }
        } else {
            return {
                embeds: [
                    new EmbedBuilder()
                        .setColor(Color.APRICOT)
                        .setDescription(oneLine`
                            ${userMention(context.userId)},
                            daily reminders will no longer bother you
                        `)
                ]
            }
        }
    }
}