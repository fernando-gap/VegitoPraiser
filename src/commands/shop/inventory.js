import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Your currently owned items bought from the shop.");

export async function execute(interaction) {
    await interaction.reply("Worker nandoka is currently implementing it.");
}

export const test = true;