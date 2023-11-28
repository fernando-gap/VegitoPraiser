const { REST, Routes } = require("discord.js");
const { clientId, token } = require("../../config.json");

const rest = new REST().setToken(token);

module.exports = async () => {
    const commands = {};
    const botcommands = await rest.get(Routes.applicationCommands(clientId));
    console.log(botcommands);
    for (const cmd of botcommands) {
        const {
            name, 
            id, 
            description
        } = cmd;

        commands[name] = { name, id, description};
    }

    return commands;
};