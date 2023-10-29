const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const readFilesRecursively = require("./util/recursive-read-files.js");
const Model = require("./src/database/models.js");
const { DatabaseConnection } = require("./src/database/database-connection.js");
const seed = require("./src/database/seed.js");
const dotenv = require("dotenv");
const path = require("path");

try {
    const db = dotenv.config({ path: path.resolve(__dirname, 
        `./db_${process.env.NODE_ENV === "production" ? "prod" : "dev"}.env`)
    });

    if (db.error) throw new Error(`Could not load database configuration file: NODE=${process.env.NODE_ENV}`);
    else console.log(`Database Configuration Loaded! Environment: ${process.env.NODE_ENV}`);

} catch (exception) {
    throw new Error("Database Configuration File is Missing", exception);
}

class Bot {
    async init() {
        await this.setup();
    }

    async database() {
    }

    async setup() {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds]});
        this.client.commands = new Collection();

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
    async init(connection) {
        this.connection = connection;
        this.model = new Model(connection);
        await seed(this.model.Property);
        this.model.sync();
    }
}

const database = new Database();
const bot = new Bot();

(async () => {
    await database.init(new DatabaseConnection());
    await bot.init();
    await bot.client.login(token);

    bot.client.once(Events.ClientReady, async c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    bot.client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
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

module.exports = {
    bot, database
};