import { EmbedBuilder, bold, userMention } from "discord.js";
import { ContextLeaderboard, View } from "../interfaces.js";
import { Reply } from "../types.js";
import { Color } from "../enums.js";

export default class ViewLeaderboard implements View {
    frontend(context: ContextLeaderboard): Reply {
        const top3 = [":first_place:", ":second_place:", ":third_place:"]
        let str = ""
        let i;

        for (i = 0; i < top3.length && i < context.users.length; i++) {
            str += top3[i] + `${userMention(context.users[i].id)} ${bold(context.users[i].praiseCount)}\n`
        }

        for (i = i+1; i < context.users.length; i++) {
            str += `${i + 1}. ${userMention(context.users[i].id)} ${bold(context.users[i].praiseCount)}\n`
        }

        return {
            embeds: [
                new EmbedBuilder()
                    .setColor(Color.APRICOT)
                    .setTitle("Praise Leaderboard")
                    .setDescription(str)
            ]
        }
    }
}