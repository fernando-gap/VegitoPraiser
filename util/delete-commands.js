const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("../config.json");

const rest = new REST().setToken(token);

(async () => {
    const commands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
    for (const cmd of commands) {
        console.log(`Deleting ${cmd.name} command.`);
        await rest.delete(Routes.applicationGuildCommand(clientId, guildId, cmd.id));
    }
})();