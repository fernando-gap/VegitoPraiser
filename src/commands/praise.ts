import { CacheType, ChatInputCommandInteraction } from "discord.js";
import {
  CommandExecutionVegitoError,
  NullChannelVegitoError,
  TransactionVegitoError,
} from "../errors.js";
import VegitoEvent from "../events.js";
import { ContextCooldown, VegitoCommand } from "../interfaces.js";
import ViewCooldown from "../views/view-cooldown.js";
import { ViewPraise } from "../views/view-praise.js";

export default class Praise extends VegitoEvent<VegitoCommand> {
  override async handleChatInputCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ) {
    if (interaction.channel === null) {
      throw new NullChannelVegitoError(
        "hourly reminder",
        "the channel cannot be null, (can't run in dms)",
      );
    }

    const contextCooldown: ContextCooldown | boolean =
      await this.cooldownValidation({
        userId: interaction.user.id,
        commandName: "praise",
        endDate: Date.now() + this.command.cooldown * 1000,
      });

    if (typeof contextCooldown !== "boolean") {
      const view = new ViewCooldown();
      await interaction.reply(view.frontend(contextCooldown));
      return;
    }

    const view = new ViewPraise();
    await interaction.reply(view.frontend({ userId: interaction.user.id }));
    try {
      await this.bot.db.transaction(async (t) => {
        await this.userDAO.increment({
          query: { where: { id: interaction.user.id } },
          extra: {
            incrementColumns: ["praiseCount", "potaraCoins"],
            transaction: t,
          },
        });
      });
    } catch (e) {
      throw new TransactionVegitoError(
        "praise command",
        "praise count or praise coins failed to increment",
        { cause: e },
      );
    }

    if (this.user === undefined) {
      throw new CommandExecutionVegitoError(
        "praise command",
        "the command needs a database user",
      );
    }

    if (this.user.reminderId === 1 /* hourly_enabled */) {
      await this.bot.scheduler.reschedule("notifyHourlyPraise", {
        userId: interaction.user.id,
        channelId: interaction.channel.id,
      });
    }
  }
}
