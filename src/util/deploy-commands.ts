import { REST, Routes } from "discord.js";
import config from "../config.js";
import { CommandProperties } from "../commands/commands.js"
import { VegitoCommand } from "../interfaces.js";
import { stripIndent } from "common-tags";
import { Environment } from "../enums.js";
import { Debug } from "../debug.js";


async function deployCommands(args: string[]) {
    const commandsProd: any[] = [];
    const commandsDev: any[] = [];
    type Command = { [x: string]: VegitoCommand }
    const commands = Object.values(CommandProperties as Command);

    for (const command of commands) {
        if (command.isProduction) {
            commandsProd.push(command.slash().toJSON())
        } else {
            commandsDev.push(command.slash().toJSON())
        }
    }

    if (args.length <= 0) {
        await deployDev(commandsDev);
        await deployProd(commandsProd);
        return;
    }

    if (args[0] === Environment.DEV) {
        await deployDev(commandsDev);
    } else if (args[0] === Environment.PROD) {
        await deployProd(commandsProd);
    } else {
        throw new Error(stripIndent`
            Invalid environment, choose either:
                -dev
                -prod
        `)
    }
}

async function deployDev(commands: any[]) {
    const rest = new REST().setToken(config.token);
    let reloadedDev: any;

    if (commands.length >= 1) {
        reloadedDev = await rest.put(
            Routes.applicationGuildCommands(
                config.clientId, config.devGuildId
            ),
            { body: commands },
        );

        Debug.status(stripIndent`Successfully reloaded DEV:${reloadedDev.length}`);
    }
}

async function deployProd(commands: any[]) {
    const rest = new REST().setToken(config.token);
    let reloadedProd: any;

    if (commands.length >= 1) {
        reloadedProd = await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );
    }

    Debug.status(stripIndent`Successfully reloaded DEV:${reloadedProd.length}`);
}

deployCommands(process.argv.slice(2))
    .then(_ => Debug.log("Finished."))
    .catch(_ => Debug.error("", _.message))