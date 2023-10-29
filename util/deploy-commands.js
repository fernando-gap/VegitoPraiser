const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("../config.json");
const readFilesRecursively = require("./recursive-read-files.js");

const commands = [];
const commandsTest = [];

readFilesRecursively("../src/commands", (file) => {
    if (file.endsWith(".js")) {
        const command = require(file);
        if ("data" in command && "execute" in command) {
            if (Object.prototype.hasOwnProperty.call(command, "test")) {
                commandsTest.push(command.data.toJSON());
            } else {
                commands.push(command.data.toJSON());
            }
        } else {
            console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
        }
    }
});

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        if (commands.length >= 1) {
            const data_prod = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            console.log(`Successfully reloaded PROD:${data_prod.length} application (/) commands.`);
        }

        if (commandsTest.length >= 1) {
            const data_dev = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commandsTest },
            );
            console.log(`Successfully reloaded DEV:${data_dev.length} application (/) commands.`);
        }
    } catch (error) {
        console.error(error);
    }
})();
