import { REST, Routes } from "discord.js";
import config from "../config/config.js";

const rest = new REST().setToken(config.token);

(async () => {
    const commands = await rest.get(
        Routes.applicationGuildCommands(config.clientId, config.guildId)
    );

    for (const cmd of commands) {
        console.log(`Deleting ${cmd.name} command.`);
        await rest.delete(
            Routes.applicationGuildCommand(config.clientId, 
                config.guildId, cmd.id)
        );
    }
})();