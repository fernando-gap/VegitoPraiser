import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { ReminderType } from "../../enums.js";
import {
  CommandExecutionVegitoError,
  NullChannelVegitoError,
  TransactionVegitoError,
} from "../../errors.js";
import VegitoEvent from "../../events.js";
import { VegitoSubCommand } from "../../interfaces.js";
import ViewNotifyDaily from "../../views/view-notify-daily.js";

export default class Daily extends VegitoEvent<VegitoSubCommand> {
  override async handleChatInputCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    if (this.user === undefined) {
      throw new CommandExecutionVegitoError(
        "daily command",
        "the command needs a database user",
      );
    }

    const isEnabled =
      interaction.options.getString("turn") === "on" ? true : false;
    const view = new ViewNotifyDaily();

    if (isEnabled) {
      /* already enabled */
      if (this.user.reminderId === ReminderType.DAILY) {
        await interaction.reply(
          view.frontend({
            userId: interaction.user.id,
            enable: false,
            alreadyEnabled: true,
          }),
        );
        /* enable overwrites all other reminders */
      } else {
        await interaction.reply(
          view.frontend({
            userId: interaction.user.id,
            enable: true,
          }),
        );

        if (interaction.channel === null) {
          throw new NullChannelVegitoError(
            "Channel is null",
            "cannot have null channel in daily reminders",
          );
        }

        const createData = {
          userId: interaction.user.id,
          channelId: interaction.channel.id,
        };

        try {
          await this.bot.db.transaction(async (t) => {
            await this.userDAO.updateReminder({
              query: {
                where: {
                  id: interaction.user.id,
                },
              },
              extra: {
                newReminderId: ReminderType.DAILY,
                transaction: t,
              },
            });
          });
        } catch (e) {
          throw new TransactionVegitoError(
            "transaction error",
            "failed to enable daily update reminder",
          );
        }

        await this.bot.scheduler.create("notifyDailyPraise", createData);
      }
    } else {
      /* already disabled */
      if (this.user.reminderId === ReminderType.DISABLED) {
        await interaction.reply(
          view.frontend({
            userId: interaction.user.id,
            alreadyDisabled: true,
            enable: false,
          }),
        );
        /* disable */
      } else {
        await interaction.reply(
          view.frontend({
            userId: interaction.user.id,
            enable: false,
          }),
        );

        try {
          await this.bot.db.transaction(async (t) => {
            await this.userDAO.updateReminder({
              query: {
                where: {
                  id: interaction.user.id,
                },
              },
              extra: {
                newReminderId: ReminderType.DISABLED,
                transaction: t,
              },
            });
          });
        } catch (e) {
          throw new TransactionVegitoError(
            "transaction failed",
            "reminder update",
            { cause: e },
          );
        }

        await this.bot.scheduler.delete("notifyDailyPraise", {
          userId: interaction.user.id,
        });
      }
    }
  }
}
