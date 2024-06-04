import {
  CacheType,
  ChatInputCommandInteraction,
  REST,
  Routes,
} from "discord.js";
import config from "../config.js";
import VegitoEvent from "../events.js";
import { VegitoCommand } from "../interfaces.js";
import { ContextHelp } from "../types.js";
import { ViewHelp } from "../views/view-help.js";

export default class Help extends VegitoEvent<VegitoCommand> {
  override async handleChatInputCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ) {
    const rest = new REST().setToken(config.token);
    const view = new ViewHelp();
    const commands = (await rest.get(
      Routes.applicationCommands(config.clientId),
    )) as ContextHelp;
    await interaction.reply(view.frontend(commands));
  }
}
