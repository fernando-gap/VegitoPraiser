const { SlashCommandBuilder } = require('discord.js');
const { praises } = require("../praises.json");

const randomPraiseMessage = () => {
    return praises[Math.floor(Math.random() * praises.length)]
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('praise')
		.setDescription("Praise Lord Vegito with a message"),
	async execute(interaction) {
		await interaction.reply(`<@${interaction.user.id}> praises Vegito with the following message:\n\n *${randomPraiseMessage()}*`);
	},
};
