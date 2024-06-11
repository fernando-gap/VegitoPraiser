import { EmbedBuilder, channelMention } from "discord.js";
import { Color } from "../enums.js";
import { ContextLofiJoin, Reply, View } from "../interfaces.js";

export default class ViewLofiJoin implements View {
  frontend(context: ContextLofiJoin): Reply {
    return {
      embeds: [
        new EmbedBuilder()
          .setColor(Color.TURQUOISE)
          .setDescription(
            `:notes: VegitoLofi is connecting to ${channelMention(context.channelId)}`,
          ),
      ],
    };
  }
}
