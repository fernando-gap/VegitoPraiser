const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const praiseCommand = require("./commands/praise.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds]});
client.commands = new Collection();

client.commands.set(praiseCommand.data.name, praiseCommand);

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
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
			await interaction.reply({ content: "Even amidst error, Vegito's unwavering spirit remains a symbol of resilience and determination, inspiring all in its wake.", ephemeral: true });
		}
	}
});

client.login(token);