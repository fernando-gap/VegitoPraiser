import { Events } from "discord.js";
import bot from "./bot.js";
import chatInputCommand from "./events/chat-input-command.js";
import autoComplete from "./events/autocomplete.js";

await bot.init();
bot.client.on(Events.InteractionCreate, chatInputCommand);
bot.client.on(Events.InteractionCreate, autoComplete);
