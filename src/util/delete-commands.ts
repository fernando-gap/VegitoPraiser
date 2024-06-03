import { REST, Routes } from "discord.js";
import config from "../config.js";
import { Debug } from "../debug.js";
import { commaListsAnd, stripIndent, stripIndents } from "common-tags";
import { Environment } from "../enums.js";

interface Command {
    name: string,
    id: string,
}

enum DeleteCommandOptions {
    ONE = "-one",
    MANY = "-many",
    ALL = "-all"
}

type HandleOption = (opts: DeleteCommandOptions, cmds: string[]) => Promise<void>;

async function options(option: string[], handleOption: HandleOption) {
    if (option[0] === DeleteCommandOptions.ONE) {
        if (option[1] === undefined) {
            throw new Error("option -one needs at least one argument")
        } else {
            await handleOption(DeleteCommandOptions.ONE, [option[1]])
        }
    } else if (option[0] === DeleteCommandOptions.MANY) {
        if (option.length < 3) {
            throw new Error("option -many needs two or more arguments, use -one")
        } else {
            await handleOption(DeleteCommandOptions.MANY, option.slice(1))
        }

    } else if (option[0] === DeleteCommandOptions.ALL) {
        handleOption(DeleteCommandOptions.ALL, [])
    } else {
        throw new Error(stripIndent`
                Invalid option, choose either:
                    -one [command]
                    -many [command_1, command_2, ...]
                    -all
            `)
    }
}

async function deleteProdCommand(option: DeleteCommandOptions, commandsToDelete: string[]) {
    const rest = new REST().setToken(config.token);

    switch (option) {
        case DeleteCommandOptions.ONE:
        case DeleteCommandOptions.MANY:
            const commands = await rest.get(Routes.applicationCommands(config.clientId)) as Command[];

            if (commands.length <= 0) {
                Debug.log("No available global commands to be deleted.");
                return;
            }

            Debug.status(stripIndent`
                    Global commands retrieved:
                        ${commaListsAnd`${commands.map(c => c.name)}`}
                `)

            for (const command of commandsToDelete) {
                const c = commands.find((c) => c.name === command)

                if (c === undefined) {
                    Debug.log(`skipping... command ${command} does not exist to be deleted`)
                    continue
                }

                await rest.delete(Routes.applicationCommand(config.clientId, c.id));
            }
            break;
        case DeleteCommandOptions.ALL:
            deleteAllCommands(Environment.PROD)
            break;
    }
}

async function deleteAllCommands(env: Environment) {
    const rest = new REST().setToken(config.token);

    if (env === Environment.DEV) {
        const commands = await rest.get(Routes.applicationGuildCommands(config.clientId, config.devGuildId)) as Command[];
        Debug.status(stripIndents`
            Commands to be deleted (${commands.length}):
            ${commaListsAnd`${commands.length}`}`);

        for (const cmd of commands) {
            await rest.delete(Routes.applicationGuildCommand(config.clientId, config.devGuildId, cmd.id));
        }
    } else if (env === Environment.PROD) {
        const commands = await rest.get(Routes.applicationCommands(config.clientId)) as Command[];
        Debug.status(stripIndents`
            Commands to be deleted (${commands.length}):
            ${commaListsAnd`${commands.map(c => c.name)}`}`);

        for (const cmd of commands) {
            await rest.delete(Routes.applicationCommand(config.clientId, cmd.id));
        }
    }
}

async function deleteDevCommand(option: DeleteCommandOptions, commandsToDelete: string[]) {

    switch (option) {
        case DeleteCommandOptions.ONE:
        case DeleteCommandOptions.MANY:
            const rest = new REST().setToken(config.token);
            const commands = await rest.get(Routes.applicationGuildCommands(config.clientId, config.devGuildId)) as Command[];
            if (commands.length <= 0) {
                Debug.log("No available guild commands to delete in the dev server.");
                return;
            }

            Debug.status(stripIndent`
                Development commands retrieved:
                    ${commaListsAnd`${commands.map(c => c.name)}`}
            `)

            for (const command of commandsToDelete) {
                const c = commands.find((c) => c.name === command)

                if (c === undefined) {
                    Debug.log(`skipping... command ${command} does not exist to be deleted`)
                    continue
                }

                await rest.delete(Routes.applicationGuildCommand(config.clientId, config.devGuildId, c.id));
            }
            break;
        case DeleteCommandOptions.ALL:
            deleteAllCommands(Environment.DEV)
            break;
    }

}


export async function deleteCommands(args: string[]) {
    if (args[0] === Environment.DEV) {
        await options(args.slice(1), deleteDevCommand)
    } else if (args[0] === Environment.PROD) {
        await options(args.slice(1), deleteProdCommand)
    } else {
        throw new Error(stripIndent`
            Invalid environment, choose either:
                -dev
                -prod
        `)
    }
}

deleteCommands(process.argv.slice(2))
    .then(() => Debug.log("Finished."))
    .catch(_ => Debug.error("", _.message))