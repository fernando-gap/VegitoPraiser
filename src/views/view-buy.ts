import { oneLine, stripIndents } from "common-tags";
import { ContextBuy, View } from "../interfaces.js";
import { Reply } from "../interfaces.js";
import { bold } from "discord.js";
import { Emoji } from "../enums.js";
import { InvalidContextViewVegitoError } from "../errors.js";

export default class ViewBuy implements View {
    frontend(context: ContextBuy): Reply {
        if (context.item === null) {
            return {
                content: oneLine`
                    Vegito's eyebrows furrowed in confusion as he read the 
                    ${bold("error")} message: ${bold("invalid shop item")},
                    his confidence momentarily faltering before he
                    quickly recalibrated his strategy.
                `
            }
        }


        if (context.description === undefined) {
            throw new InvalidContextViewVegitoError("buy view", "Missing description properties for buy view")
        }

        if (context.description.diff !== undefined) {
            return {
                content: stripIndents`
                    Not enough money to buy ${bold(context.item)} (${context.description.price}${Emoji.POTARA_EARRINGS}):
                    > You have: ${context.description.currentPotaraCoins}${Emoji.POTARA_EARRINGS}, but you need: ${context.description.diff}${Emoji.POTARA_EARRINGS}
                `
            }
        }


        return {
            content: stripIndents`
                > You bought ${bold(context.item)}${context.description.emoji} for ${bold(String(context.description.price))}${Emoji.POTARA_EARRINGS}
                > You now have ${bold(String(context.description.currentPotaraCoins))}${Emoji.POTARA_EARRINGS}
            `
        }
    }
}