import { Events } from "discord.js";
import bot from "./bot.js";
import interactionCreate from "./events/interaction-create.js";

await bot.init();
bot.client.on(Events.InteractionCreate, interactionCreate);
