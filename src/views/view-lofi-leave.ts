import { EmbedBuilder } from "discord.js";
import { Color } from "../enums.js";
import { ContextLofiLeave, Reply, View } from "../interfaces.js";

export default class ViewLofiLeave implements View {
  frontend(context: ContextLofiLeave): Reply {
    if (context.exist)
      return {
        embeds: [
          new EmbedBuilder()
            .setColor(Color.FROST)
            .setDescription(":magic_wand: VegitoLofi is leaving the channel"),
        ],
      };
    else
      return {
        embeds: [
          new EmbedBuilder()
            .setColor(Color.FROST)
            .setDescription("Not connected to leave"),
        ],
      };
  }
}
