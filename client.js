const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const readFilesRecursively = require("./util/recursive-read-files.js");
const buildModel = require("./src/database/models");
const DatabaseFactory = require("./src/database/database-factory");

const client = new Client({ intents: [GatewayIntentBits.Guilds]});
client.commands = new Collection();

readFilesRecursively("../src/commands", (file) => {
    const command = require(file);
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
    }
});

client.once(Events.ClientReady, async c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    const db = await DatabaseFactory.getDatabase();
    const model = await buildModel(db.db);
    await model.User.sync();
    await model.Property.sync();
    await model.UserProperty.sync();
    await db.close();
});

client.on(Events.InteractionCreate, async interaction => {
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

client.login(token);