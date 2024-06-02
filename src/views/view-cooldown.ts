import { oneLine, stripIndents } from "common-tags";
import { ContextCooldown, View } from "../interfaces.js";
import { Reply } from "../types.js";
import { bold, italic, time } from "discord.js";


export default class ViewCooldown implements View {
    frontend(context: ContextCooldown): Reply {
        return {
            content: stripIndents`
                ${oneLine`
                    As Vegito hones his strength between battles, 
                    embrace this ${bold("cooldown")} to recharge. 
                    Your next praise will be even more powerful.`}

                ${italic(oneLine` 
                    ${time(context.expiredTimestamp, "R")}, 
                    unleash the praise and amplify your strength!`)}
                `,
            ephemeral: true
        }
    }
}