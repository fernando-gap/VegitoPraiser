import { getVoiceConnection } from "@discordjs/voice";
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { CommandExecutionVegitoError } from "../../errors.js";
import VegitoEvent from "../../events.js";
import { VegitoSubCommand } from "../../interfaces.js";
import ViewLofiLeave from "../../views/view-lofi-leave.js";

export default class Leave extends VegitoEvent<VegitoSubCommand> {
  override async handleChatInputCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    if (interaction.guildId === null) {
      throw new CommandExecutionVegitoError(
        "interaction.guildId",
        "Command needs a valid guild id",
      );
    }

    const connection = getVoiceConnection(interaction.guildId);
    const view = new ViewLofiLeave();
    if (connection === undefined) {
      await interaction.reply(view.frontend({ exist: false }));
    } else {
      await interaction.reply(view.frontend({ exist: true }));
    }

    connection?.destroy();
  }
}
