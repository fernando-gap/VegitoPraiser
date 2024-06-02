import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { VegitoCommand } from "../../interfaces.js";
import VegitoEvent from "../../events.js";
import { DataAccessShop } from "../../database/data-access.js";
import Bot from "../../bot.js";
import ViewShop from "../../views/view-shop.js";
import { ContextShop } from "../../types.js";

export default class Shop extends VegitoEvent<VegitoCommand> {
    shopDAO: DataAccessShop;

    constructor(bot: Bot, command: VegitoCommand) {
        super(bot, command)
        this.shopDAO = new DataAccessShop(this.bot.db)
    }

    override async handleChatInputCommand(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const items = await this.shopDAO.selectAll({
            query: {
                limit: 50,
                offset: 0,
                order: [["price", "ASC"]]
            }
        })

        const view = new ViewShop()
        const contextShop: ContextShop = items.map(v => v.dataValues);
        await interaction.reply(view.frontend(contextShop))
    }
}