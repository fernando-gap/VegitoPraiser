const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const embedHelp = new EmbedBuilder()
    .setColor(0x0047AB)
    .setTitle("Vegito Praiser /help")
    .setDescription("Command guide for using VegitoPraiser Bot.")
    .addFields(
        { name: "/praise", value: "Praise Lord Vegito with a message."},
        { name: "/stats", value: "For checking how many praises you did."},
        { name: "/notify", value: "Enable notifications to praise Vegito once a day."}
    );

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("General guidance and commands overview."),
    async execute(interaction) {
        await interaction.reply({ 
            embeds: [embedHelp]
        });
    }
};
