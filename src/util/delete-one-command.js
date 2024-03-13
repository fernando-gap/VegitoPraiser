import { REST, Routes } from "discord.js";
import config from "../config/config.js";

const rest = new REST().setToken(config.token);

(async () => {
    const commands = await rest.get(
        Routes.applicationCommands(config.clientId)
    );

    if (process.argv[2] === undefined) {
        console.log("No commands selected.");
        return;
    }

    for (const cmd of commands) {
        if (process.argv[2] === cmd.name) {
            console.log(`Deleting ${cmd.name} command`);
            await rest.delete(
                Routes.applicationCommand(config.clientId, cmd.id)
            );
            break;
        }
    }
})();