import { oneLine, stripIndents } from "common-tags";
import { SlashCommandBuilder, bold } from "discord.js";
import { DataAccessFactory } from "../../database/data-access-factory.js";

export const data = new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy Vegito shop items with Potara Coins.")
    .addStringOption(option =>
        option.setName("item_id")
            .setDescription("The id of an item in the shop.")
            .setAutocomplete(true)
            .setRequired(true));

export async function execute(interaction) {
    const option = interaction.options.getString("item_id");
    const userDAO = await DataAccessFactory.getUser(interaction.bot.db);
    const shopDAO = await DataAccessFactory.getShop(interaction.bot.db);
    const user = await userDAO.selectOne({ id: interaction.user.id });
    const item = await shopDAO.selectOne({ code: option });

    if (item == null) {
        return await interaction.reply({
            content: oneLine`
                Vegito's eyebrows furrowed in confusion as he read the 
                ${bold("error")} message: ${bold("invalid shop item")},
                his confidence momentarily faltering before he
                quickly recalibrated his strategy.
            `
        });
    }

    /* checks whether user has enough money */
    if (user.dataValues.potara_coins >= item.dataValues.price) {
        const inventoryDAO = await DataAccessFactory.getInventory(interaction.bot.db);
        const t = await interaction.bot.db.transaction();

        try {

            await inventoryDAO.create(
                { user_id: interaction.user.id, item_code: option },
                { transaction: t }
            );

            user.potara_coins -= item.dataValues.price;
            await user.save({ transaction: t });
            await t.commit();

        } catch (e) {
            await t.rollback();
        }

        const d = { 
            emoji: interaction.bot.config.emojis.potara_coins
        };

        const content = stripIndents`
            > You bought ${bold(item.name)}${item.emoji} for ${bold(item.price)}${d.emoji}
            > You currently have ${bold(user.potara_coins)}${d.emoji}
        `;

        await interaction.reply({ content: content });

    } else {
        const d = {
            coins: bold(user.dataValues.potara_coins),
            emoji: interaction.bot.config.emojis.potara_coins,
            diff: item.dataValues.price - user.dataValues.potara_coins
        };

        return await interaction.reply({
            content: stripIndents`
                Not enough money to buy ${bold(item.dataValues.name)}:
                > You have: ${d.coins}${d.emoji} but you need: ${d.diff}${d.emoji}
            `
        });
    }
}

export async function autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    let filtered;

    if (interaction.bot.config.shop === undefined) {
        const shop = await DataAccessFactory.getShop(interaction.bot.db);
        filtered = await shop.selectAll(50, 0);
        interaction.bot.config.shop = filtered;
    } else {
        filtered = interaction.bot.config.shop;
    }

    filtered = filtered.filter(choice => {
        if (choice.dataValues.name.toLowerCase().includes(focusedValue.toLowerCase())) {
            return choice;
        }

        if (choice.dataValues.code.includes(focusedValue.toLowerCase())) {
            return choice;
        }
    });

    await interaction.respond(
        filtered.map(choice => ({ name: choice.dataValues.name, value: choice.dataValues.code })),
    );
}

export const test = true;