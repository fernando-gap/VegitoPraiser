import { Events } from "discord.js";
import bot from "./bot.js";
import clientReady from "./events/client-ready.js";
import interactionCreate from "./events/interaction-create.js";

await bot.init();

bot.client.once(Events.ClientReady, clientReady);
bot.client.on(Events.InteractionCreate, interactionCreate);