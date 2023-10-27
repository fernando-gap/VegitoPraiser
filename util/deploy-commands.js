const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("../config.json");
const readFilesRecursively = require("./recursive-read-files.js");

const commands = [];

readFilesRecursively("../../src/commands", (file) => {
    if (file.endsWith(".js")) {
        const command = require(file);
        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
        }
    }
});

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");
        let data;

        if (process.env.IS_DEPLOY === "true") {
            data = await rest.put(
                Routes.applicationCommand(clientId),
                { body: commands },
            );
        } else if (process.env.IS_DEPLOY === "false") {
            data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
        } else {
            throw new Error("Invalid Option for Environment Variable, acceptable: true or false");
        }

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
