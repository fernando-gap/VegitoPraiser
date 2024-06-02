import { AutocompleteInteraction, CacheType, ChatInputCommandInteraction, Events, Interaction, bold } from "discord.js";
import Bot from "./bot.js";
import config from "./config.js";
import { CommandExecutionVegitoError, NestedSubCommandVegitoError, TransactionVegitoError } from "./errors.js";
import { Debug } from "./debug.js";
import { oneLine } from "common-tags";
import { DataAccessUser } from "./database/data-access.js";
import User from "./database/models/user.js";
import { Model } from "sequelize-typescript";
import { ContextCooldown, JobDataCooldown, VegitoSubCommand } from "./interfaces.js";
import { Job } from "@hokify/agenda";
import { CommandType } from "./types.js";


export default abstract class VegitoEvent<Command extends CommandType> {
    command: Command;
    userDAO: DataAccessUser;
    user?: User & Model<{}, {}>;

    constructor(protected bot: Bot, command: Command) {
        this.userDAO = new DataAccessUser(this.bot.db);
        this.command = command;
    }

    abstract handleChatInputCommand(interaction: ChatInputCommandInteraction<CacheType>): Promise<void>;

    /* most commands does not have autocomplete */
    protected async handleAutocomplete(_interaction: AutocompleteInteraction<CacheType>): Promise<void> {};

    setUp(subcommands?: VegitoEvent<VegitoSubCommand>[]): void {
        if (subcommands !== undefined && subcommands.length > 0) {
            if (this.isSubCommand(this.command)) {
                throw new NestedSubCommandVegitoError("nested sub-command", "A sub-command cannot have another sub-command");
            }

            for (const subcommand of subcommands) {
                subcommand.setUp();
            }
        } 
        else {
            try {
                if (this.isSubCommand(this.command)) {
                    this.setupSubCommandEvents();
                } {
                    this.setupCommandEvents();
                }
            } catch (e) {
                Debug.error(`command error at ${this.command.name}`, e);
            }
        }
    }

    public isSubCommand(command: CommandType): command is VegitoSubCommand {
        return "parent" in command;
    }

    private setupCommandEvents(): void {
        this.bot.on(Events.InteractionCreate, async interaction => { if ("commandName" in interaction) {

                if (interaction.commandName !== this.command.name) {
                    Debug.log(`The command ${interaction.commandName} can't be handled by ${this.command.name}`);
                    return;
                }

                Debug.status(`Executing command ${interaction}`)

                if (interaction.isChatInputCommand()) {
                    await this.setDatabase(interaction);
                    if (interaction.replied || interaction.deferred) return; // development
                    await this.userLoad(interaction);
                    await this.handleChatInputCommand(interaction)
                } else if (interaction.isAutocomplete()) {
                    await this.setDatabase(interaction);
                    await this.handleAutocomplete(interaction);
                }
            }

        });
    }

    private setupSubCommandEvents(): void {
        this.bot.on(Events.InteractionCreate, async interaction => { 
            if ("commandName" in interaction) {
                if (!this.isSubCommand(this.command)) return;

                if (interaction.commandName !== this.command.parent.name) {
                    Debug.log(`The command ${interaction.commandName} can't be handled by ${this.command.name}`);
                    return;
                }


                Debug.status(`Executing sub-command ${interaction}`)

                if (interaction.isChatInputCommand()) {
                    const subcommandName = interaction.options.getSubcommand(true);

                    if (subcommandName !== this.command.name) {
                        Debug.log(`The command ${interaction.commandName} can't be handled by sub-command /${this.command.parent.name} ${this.command.name}`);
                        return;
                    }

                    await this.setDatabase(interaction);
                    if (interaction.replied || interaction.deferred) return; // development
                    await this.userLoad(interaction);
                    await this.handleChatInputCommand(interaction)
                } else if (interaction.isAutocomplete()) {
                    await this.setDatabase(interaction);
                    await this.handleAutocomplete(interaction);
                }
            }

        });
    }

    private async userLoad(interaction: Interaction<CacheType>) {
        try {
            await this.bot.db.transaction(async t => {
                const r = await this.userDAO.createUser({
                    query: {
                        where: {
                            id: interaction.user.id
                        }
                    },
                    extra: {
                        defaults: {
                            id: interaction.user.id,
                            reminderId: 0, /* disabled */
                        },
                        transaction: t
                    }
                });
                this.user = r[0]
            })
        } catch (e) {
            await this.error(interaction, e);
            throw new TransactionVegitoError("create or find user", "Unable to create or retrieve new/old user", { cause: e })
        }

        if (this.user === undefined)
            throw new TransactionVegitoError("bug", "Transaction completed but user not assigned.")
    }

    private async setDatabase(interaction: Interaction<CacheType>) {
        /* can interaction.guildId be null ? */
        if (config.devGuildId === interaction.guildId) {
            await this.bot.connectDev();
            return;
        } else {
            if (this.bot.isDev()) {
                if (!interaction.isAutocomplete()) {
                    await interaction.reply(oneLine`Worker ${bold("Nandoka")} is currently doing maintenance :3`)
                    return;
                }
            }

            await this.bot.connectProd();
        }
    }

    protected async error(interaction: Interaction<CacheType>, e: unknown) {
        const error = new CommandExecutionVegitoError("command execute", "the command have thrown an error", { cause: e })
        error.report();

        if (interaction.isAutocomplete()) {
            Debug.error("autocomplete error", e);
            return;
        }

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: oneLine`
                    Even in the face of error, Vegito's unwavering spirit 
                    remains a symbol of resilience and perseverance, 
                    transcending any temporary setback. His legacy 
                    of courage and strength echoes throughout the universe, 
                    serving as a beacon of hope and determination for all.  `,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: oneLine`
                    Even amidst ${bold("error")}, Vegito's unwavering 
                    spirit remains a symbol of resilience and determination, 
                    inspiring all in its wake.`,
                ephemeral: true
            });
        }

    }

    protected async cooldownValidation(dataCooldown: JobDataCooldown): Promise<ContextCooldown | boolean> {
        const userCooldown: Job<any>[] = await this.bot.scheduler.drive.jobs({
            name: "cooldown",
            "data.userId": dataCooldown.userId,
            "data.commandName": dataCooldown.commandName
        });

        if (userCooldown.length >= 1) {
            const user: JobDataCooldown = userCooldown[0].attrs.data;
            const expiredTimestamp = Math.round(user.endDate / 1000);

            return { expiredTimestamp: expiredTimestamp }
        } else {
            if (dataCooldown.endDate > 0) {
                await this.bot.scheduler.create("cooldown", dataCooldown);
                return true
            }
        }

        return false
    }
}