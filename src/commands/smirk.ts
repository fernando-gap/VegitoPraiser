import { CacheType, ChatInputCommandInteraction } from "discord.js";
import VegitoEvent from "../events.js";
import { VegitoCommand } from "../interfaces.js";
import { ViewSmirk } from "../views/view-smirk.js";

export default class Smirk extends VegitoEvent<VegitoCommand> {
  override async handleChatInputCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ) {
    await interaction.reply(
      new ViewSmirk().frontend({
        type: interaction.options.getString("type"),
        who: interaction.options.getUser("who")?.id,
      }),
    );
  }
}
