import { oneLine, stripIndents } from "common-tags";
import { bold, italic, time } from "discord.js";
import { ContextCooldown, Reply, View } from "../interfaces.js";

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
      ephemeral: true,
    };
  }
}
