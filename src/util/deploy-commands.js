import { REST, Routes } from "discord.js";
import config from "../config/config.js";
import readFiles from "./recursive-read-files.js";
import { oneLine } from "common-tags";

const commands = [];
const commandsTest = [];
const rest = new REST().setToken(config.token);

(async () => {
    try {
        const files = await readFiles("../commands");
        for (const file of files) {
            const command = await import(file);
            if ("data" in command && "execute" in command) {
                if (Object.prototype.hasOwnProperty.call(command, "test")) {
                    commandsTest.push(command.data.toJSON());
                } else {
                    commands.push(command.data.toJSON());
                }
            } else {
                console.log(oneLine`
                    [WARNING] The command at ${file} is missing 
                    a required "data" or "execute" property.`
                );
            }
        }

        console.log("Started refreshing application (/) commands.");

        if (commands.length >= 1) {
            const data_prod = await rest.put(
                Routes.applicationCommands(config.clientId),
                { body: commands },
            );

            console.log(oneLine`
                Successfully reloaded PROD:${data_prod.length} 
                application (/) commands.
            `);
        }

        if (commandsTest.length >= 1) {
            const data_dev = await rest.put(
                Routes.applicationGuildCommands(
                    config.clientId, config.guildId
                ),
                { 
                    body: commandsTest 
                },
            );
            console.log(oneLine`
                Successfully reloaded DEV:${data_dev.length} 
                application (/) commands.
            `);
        }
    } catch (error) {
        console.error(error);
    }
})();
