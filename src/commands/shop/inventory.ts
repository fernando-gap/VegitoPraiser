import { CacheType, ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot.js";
import { DataAccessShop } from "../../database/data-access.js";
import InventoryModel from "../../database/models/inventory.js";
import VegitoEvent from "../../events.js";
import { ContextInventory, VegitoCommand } from "../../interfaces.js";
import ViewInventory from "../../views/view-inventory.js";

export default class Inventory extends VegitoEvent<VegitoCommand> {
  private shopDAO: DataAccessShop;

  constructor(bot: Bot, command: VegitoCommand) {
    super(bot, command);
    this.shopDAO = new DataAccessShop(this.bot.db);
  }
  override async handleChatInputCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    const items = await this.shopDAO.selectUserItems({
      query: {
        where: {
          id: interaction.user.id,
        },
      },
    });

    const viewItems: ContextInventory["items"] = [];

    for (const item of items) {
      const amount = ((item.users[0] as any).Inventory as InventoryModel)
        .amount;

      viewItems.push({
        amount: amount,
        emoji: item.emoji,
      });
    }

    const view = new ViewInventory();
    await interaction.reply(
      view.frontend({
        delimiter: "•",
        avatarURL: interaction.user.displayAvatarURL(),
        items: viewItems,
        name: interaction.user.username,
      }),
    );
  }
}
