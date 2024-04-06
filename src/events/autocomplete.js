import { oneLine } from "common-tags";
import bot from "../bot.js";

export default async interaction => {
    if (!interaction.isAutocomplete()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(oneLine`
            No autocompleting command ${interaction.commandName} 
            was found.
        `);
        return;
    }

    try {
        interaction.bot = bot;
        await command.autocomplete(interaction);
    } catch (e) {
        console.error(e);
    }
};