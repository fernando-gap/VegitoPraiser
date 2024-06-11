import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
} from "discord.js";
import Bot from "../bot.js";
import {
  DataAccessInventory,
  DataAccessShop,
} from "../database/data-access.js";
import Shop from "../database/models/shop.js";
import {
  CommandExecutionVegitoError,
  NullChannelVegitoError,
  TransactionVegitoError,
} from "../errors.js";
import VegitoEvent from "../events.js";
import { ContextCooldown, VegitoCommand } from "../interfaces.js";
import { QueryReturn } from "../types.js";
import ViewCooldown from "../views/view-cooldown.js";
import { ViewPraise } from "../views/view-praise.js";

export default class Praise extends VegitoEvent<VegitoCommand> {
  private inventoryDAO: DataAccessInventory;
  private shopDAO: DataAccessShop;
  private shopItems: QueryReturn<Shop>[] = [];

  constructor(bot: Bot, command: VegitoCommand) {
    super(bot, command);
    this.shopDAO = new DataAccessShop(this.bot.db);
    this.inventoryDAO = new DataAccessInventory(this.bot.db);
  }

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

  protected override async handleAutocomplete(
    interaction: AutocompleteInteraction<CacheType>,
  ): Promise<void> {
    const c = await this.shopDAO.selectUserItems({
      query: {
        where: {
          id: interaction.user.id,
        },
      },
    });

    console.log(c[0]);
    console.log(c[0].users[0]);
    //   const focusedValue = interaction.options.getFocused();

    //   if (this.shopItems.length <= 0) {
    //     this.shopItems = await this.shopDAO.selectAll({ query: {} });
    //   }

    //   const prediction = this.shopItems.filter((choice) => {
    //     if (choice.name.toLowerCase().includes(focusedValue.toLowerCase())) {
    //       return choice;
    //     }

    //     if (choice.code.includes(focusedValue.toLowerCase())) {
    //       return choice;
    //     }

    //     return null;
    //   });

    //   await interaction.respond(
    //     prediction.map((choice) => ({
    //       name: choice.name,
    //       value: String(choice.id),
    //     })),
    //   );
  }
}
