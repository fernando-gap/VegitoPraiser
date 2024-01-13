import { REST, Routes } from "discord.js";
import config from "../config/config.js";

const getCommands = async () => {
    const rest = new REST().setToken(config.token);
    const commands = {};
    const botcommands = await rest.get(
        Routes.applicationCommands(config.clientId)
    );

    for (const cmd of botcommands) {
        const { name, id, description } = cmd;
        commands[name] = { name, id, description};
    }

    return commands;
};

export default await getCommands();
