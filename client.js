const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const { token, guildId } = require("./config.json");
const readFilesRecursively = require("./util/recursive-read-files.js");
const Model = require("./src/database/models.js");
const DataAccessFactory = require("./src/database/data-access-factory");
const DatababaseConnectionFactory = require("./src/database/database-connection-factory");
const Scheduler = require("./src/scheduler/scheduler.js");
const process = require("node:process");

class Bot {
    async init() {
        await this.setup();
    }

    async setup() {
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
}

class Database {
    async init() {
        this.model = new Model(this.connection);
        await this.model.sync();
        this.isProduction = null;
    }

    setConnection(connection, isProduction = false) {
        this.connection = connection;
        this.isProduction = isProduction;
    }

    isProductionConnection() {
        return this.currentType;
    }
}

const database = new Database();
const bot = new Bot();

(async () => {
    await bot.init();
    await bot.client.login(token);

    try {
        if (process.env.NODE_ENV === "production") {
            database.setConnection(await DatababaseConnectionFactory.getConnection(), true);
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

    const scheduler = new Scheduler(database);

    if (bot.client.isReady()) {
        console.log("Scheduler starting... Client was already ready");
        await scheduler.start(bot.client);
    }

    bot.client.once(Events.ClientReady, async c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
        console.log("Scheduler starting... Client just become ready");
        await scheduler.bree.start(bot.client);
    });

    bot.client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

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
                    content: `As Vegito hones his strength between battles, embrace this **cooldown** to recharge. Your next praise will be even more powerful.\n\n *In <t:${expiredTimestamp}:R>, unleash the praise and amplify your strength!.*`, ephemeral: true });

            } 
            timestamps.delete(interaction.user.id);
        }

        timestamps.set(interaction.user.id, now);
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
        const user = await DataAccessFactory.getUser(interaction.db);
        await user.create(interaction.user.id);
        
        try {
            interaction.client = bot.client;
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