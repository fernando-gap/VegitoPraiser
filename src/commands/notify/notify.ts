import { AutocompleteInteraction, CacheType, ChatInputCommandInteraction } from "discord.js";
import VegitoEvent from "../../events.js";
import { VegitoCommand } from "../../interfaces.js";

export default class Notify extends VegitoEvent<VegitoCommand> {
    override async handleChatInputCommand(_interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {}
    override async handleAutocomplete(_interaction: AutocompleteInteraction<CacheType>): Promise<void> {}
}