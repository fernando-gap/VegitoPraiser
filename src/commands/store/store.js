import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("store")
    .setDescription("Buy items with Vegito Praiser Points (PP)");

export async function execute(interaction) {
    await interaction.reply("Worker nandoka is currently implementing it.");
}

export const test = true;