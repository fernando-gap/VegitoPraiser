import { Client, Collection, GatewayIntentBits } from "discord.js";
import { DatabaseConnectionFactory } from "./database/database-connection-factory.js";
import { CooldownJob, DailyReminderPraiseJob, FortnightReminderJob, HourlyReminderPraiseJob } from "./scheduler/jobs.js";
import config from "./config/config.js";
import Model from "./database/models.js";
import Scheduler from "./scheduler/scheduler.js";
import readFilesRecursively from "./util/recursive-read-files.js";
import { oneLine } from "common-tags";

class Bot {
    static instance = null;

    static create() {
        if (!Bot.instance) {
            Bot.instance = new Bot();
        }

        return Bot.instance;
    }

    async init() {
        await this.setupClient();
        await this.setupConfiguration();
        await this.setupDatabase();
        await this.setupScheduler();
    }

    async setupClient() {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
        this.client.commands = new Collection();

        const files = await readFilesRecursively("../commands");
        for (const file of files) {
            const command = await import(file);
            if ("data" in command && "execute" in command) {
                this.client.commands.set(command.data.name, command);
            } else {
                console.log(oneLine`
                    [WARNING] The command 
                    at ${file} is missing a required "data" or "execute"
                    property.`
                );
            }
        }
        await this.client.login(config.token);
    }
    async setupConfiguration() {
        this.config = {
            colors: await import("./config/colors.js"),
            commands: (await import("./config/commands.js")).default
        };
    }

    async setupDatabase(NODE_ENV = process.env.NODE_ENV) {
        try {
            const c = await DatabaseConnectionFactory.getConnection(NODE_ENV);
            this.model = new Model(c);
            await this.model.sync();
            this.db = c;
        } catch (e) {
            console.log(oneLine`
                Database Connection Error on 
                "${process.env.NODE_ENV}" Environment`, e
            );

            process.exit(1); /* to force pm2 to reload process. */
        }

    }

    async setupScheduler() {
        const scheduler = new Scheduler();

        scheduler.add(new HourlyReminderPraiseJob("hourly_reminder_praise"));
        scheduler.add(new DailyReminderPraiseJob("daily_reminder_praise"));
        scheduler.add(new CooldownJob("cooldown"));

        /* 
        * jobs that shouldn't run or be created in 
        * development because they affect other 
        * servers even in development mode.
        */
        scheduler.add(new FortnightReminderJob("fortnight_everynone_reminder"));

        if (process.env.NODE_ENV === "production") {
            scheduler.createSingle("fortnight_everynone_reminder", {
                channel_id: config.guild_channels[config.guildId] 
            });
        }

        await scheduler.start();
        this.scheduler = scheduler;
    }
}

export default Bot.create();