import { CacheType, ChatInputCommandInteraction } from "discord.js";
import VegitoEvent from "../../events.js";
import { VegitoCommand } from "../../interfaces.js";


export default class Notify extends VegitoEvent<VegitoCommand> {
    // @ts-ignore: command that has sub-commands does not handle interactions
    // eslint-disable-next-line
    override handleChatInputCommand(_interaction: ChatInputCommandInteraction<CacheType>): Promise<void> { }
}