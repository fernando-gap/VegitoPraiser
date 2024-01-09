const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const { token, guildId, guild_channels } = require("./config.json");
const readFilesRecursively = require("./util/recursive-read-files.js");
const Model = require("./src/database/models.js");
const DataAccessFactory = require("./src/database/data-access-factory");
const DatababaseConnectionFactory = require("./src/database/database-connection-factory");
const Scheduler = require("./src/scheduler/scheduler.js");
const process = require("node:process");
const { HourlyReminderPraiseJob, DailyReminderPraiseJob, FortnightReminderJob, CooldownJob } = require("./src/scheduler/jobs.js");

class Bot {
    async init() {
        await this.setupClient();
        await this.setupConfiguration();
    }

    async setupClient() {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds]});
        this.client.commands = new Collection();
        this.client.cooldowns = new Collection();

        readFilesRecursively("../src/commands", (file) => {
            const command = require(file);
            if ("data" in command && "execute" in command) {
                this.client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
            }
        });
    }
    async setupConfiguration() {
        this.config = {
            colors: require("./src/config/colors.js"),
            commands: await require("./src/config/commands.js")()
        };
    }
}

class Database {
    async init() {
        this.model = new Model(this.connection);
        await this.model.sync();
    }

    setConnection(connection) {
        this.connection = connection;
    }
}

const database = new Database();
const bot = new Bot();

(async () => {
    await bot.init();
    await bot.client.login(token);

    /*
    * Create connection to database dev or prod. 
    */

    try {
        if (process.env.NODE_ENV === "production") {
            database.setConnection(await DatababaseConnectionFactory.getConnection());
        } else {
            database.setConnection(await DatababaseConnectionFactory.getDevelopmentConnection());
        }
        /* models and database sync happens here */
        await database.init();
    } catch(e) {
        console.log(e);
        console.log(`Database Connection Error on "${process.env.NODE_ENV}" Environment`);
        process.exit(1);
    }

    /*
    * Start Scheduler when it already exists or
    * wait for bot to login.
    */

    const scheduler = new Scheduler(bot);
    /* job that have many instances */
    scheduler.add(new HourlyReminderPraiseJob("hourly_reminder_praise"));
    scheduler.add(new DailyReminderPraiseJob("daily_reminder_praise"));
    scheduler.add(new CooldownJob("cooldown"));

    /* jobs that are single */
    scheduler.add(new FortnightReminderJob("fortnight_everynone_reminder"));
    await scheduler.createSingle("fortnight_everynone_reminder", { channel_id: guild_channels[guildId] });
    await scheduler.start();

    bot.client.once(Events.ClientReady, async c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    /*
    * Executes on a slash command
    */

    bot.client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        /*
        * Cooldown
        */

        // let userCooldown = await scheduler.jobs({ name: "cooldown", "data.user_id": interaction.user.id })

        // if (userCooldown.length >= 1) {
        //     const user = userCooldown[0];
        // }

        const { cooldowns } = bot.client;
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultlCooldown = 0; // no cooldown
        const cooldownAmount = (command.cooldown ?? defaultlCooldown) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({ 
                    content: `As Vegito hones his strength between battles, embrace this **cooldown** to recharge. Your next praise will be even more powerful.\n\n *<t:${expiredTimestamp}:R>, unleash the praise and amplify your strength!*`, ephemeral: true });

            } 
            timestamps.delete(interaction.user.id);
        }

        timestamps.set(interaction.user.id, now);

        /*
        * Development Server
        */

        if (guildId === interaction.guildId) {
            try {
                database.setConnection(await DatababaseConnectionFactory.getDevelopmentConnection());
            } catch (e) {
                console.log(e);
                await interaction.reply("**Development Database Not Connected**", { ephemeral: true });
                return;
            }
        } else {
            if (process.env.NODE_ENV === "production") {
                database.setConnection(await DatababaseConnectionFactory.getConnection());
            } else {
                await interaction.reply("Worker *Nandoka* is currently doing maintenance :3");
                return;
            }
        } 
        
        await database.init();
        interaction.db = database;
        interaction.bot = bot;
        interaction.scheduler = scheduler;

        try {

            /*
            * Ensure the user exists
            */ 

            const user = await DataAccessFactory.getUser(interaction.db);
            await user.create(interaction.user.id);

            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "Even in the face of error, Vegito's unwavering spirit remains a symbol of resilience and perseverance, transcending any temporary setback. His legacy of courage and strength echoes throughout the universe, serving as a beacon of hope and determination for all.", ephemeral: true });
            } else {
                await interaction.reply({ content: "Even amidst **error**, Vegito's unwavering spirit remains a symbol of resilience and determination, inspiring all in its wake.", ephemeral: true });
            }
        }
    });
})();

process.on("uncaughtException", (err, origin) => {
    console.log(err, origin);
    process.exit(1);
});

module.exports = {
    bot, database
};