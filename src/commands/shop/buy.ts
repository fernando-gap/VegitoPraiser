import { AutocompleteInteraction, CacheType, ChatInputCommandInteraction } from "discord.js";
import VegitoEvent from "../../events.js";
import { VegitoCommand } from "../../interfaces.js";
import { DataAccessInventory, DataAccessShop } from "../../database/data-access.js";
import Bot from "../../bot.js";
import ViewBuy from "../../views/view-buy.js";
import { CommandExecutionVegitoError, TransactionVegitoError } from "../../errors.js";
import { QueryReturn } from "../../types.js";
import Shop from "../../database/models/shop.js";

export default class Buy extends VegitoEvent<VegitoCommand> {
    private shopDAO: DataAccessShop;
    private inventoryDAO: DataAccessInventory;
    private shopItems: QueryReturn<Shop>[] = [];

    constructor(bot: Bot, command: VegitoCommand) {
        super(bot, command)
        this.shopDAO = new DataAccessShop(this.bot.db)
        this.inventoryDAO = new DataAccessInventory(this.bot.db)
    }

    override async handleChatInputCommand(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const option = interaction.options.getString("id", true);
        console.log(option)
        const view = new ViewBuy()

        const itemChosen = await this.shopDAO.selectOne({
            query: {
                where: {
                    id: option
                }
            }
        });

        console.log(itemChosen)

        if (itemChosen === null) {
            await interaction.reply(view.frontend({ item: null }))
            return;
        }

        if (this.user === undefined) {
            throw new CommandExecutionVegitoError("Buy command", "command needs an existing user in the database")
        }

        if (this.user.potaraCoins >= itemChosen.price) {
            try {
                await this.bot.db.transaction(async t => {
                    console.log(itemChosen, itemChosen.id)
                    await this.inventoryDAO.create(
                        {
                            userId: interaction.user.id,
                            shopId: itemChosen.id
                        },
                        {
                            transaction: t
                        }
                    );

                    if (this.user === undefined) {
                        throw new CommandExecutionVegitoError("Buy command", "command needs an existing user in the database")
                    }

                    this.user.potaraCoins -= itemChosen.price;
                    await this.user.save({ transaction: t });
                })
            } catch (e) {
                throw new TransactionVegitoError("transaction error", "the item couldn't be bought", { cause: e })
            }

            await interaction.reply(view.frontend({
                item: itemChosen.name,
                description: {
                    emoji: itemChosen.emoji,
                    price: itemChosen.price,
                    currentPotaraCoins: this.user.potaraCoins
                }
            }))
        } else {
            await interaction.reply(view.frontend({
                item: itemChosen.name,
                description: {
                    emoji: itemChosen.emoji,
                    price: itemChosen.price,
                    currentPotaraCoins: this.user.potaraCoins,
                    diff: itemChosen.price - this.user.potaraCoins
                }
            }));
        }
    }

    protected override async handleAutocomplete(interaction: AutocompleteInteraction<CacheType>): Promise<void> {
        const focusedValue = interaction.options.getFocused();

        if (this.shopItems.length <= 0) {
            this.shopItems = await this.shopDAO.selectAll({ query: {} });
        }

        const prediction = this.shopItems.filter(choice => {
            if (choice.name.toLowerCase().includes(focusedValue.toLowerCase())) {
                return choice;
            }

            if (choice.code.includes(focusedValue.toLowerCase())) {
                return choice;
            }

            return null
        });

        await interaction.respond(
            prediction.map(choice => ({ name: choice.name, value: String(choice.id) })),
        );
    }
}