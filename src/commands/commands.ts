import { SlashCommandBuilder } from "discord.js";
import { VegitoCommand, VegitoSubCommand } from "../interfaces.js";

export namespace CommandProperties {
  export const help: VegitoCommand = {
    cooldown: 0,
    isProduction: true,
    name: "help",
    slash: () =>
      new SlashCommandBuilder()
        .setName("help")
        .setDescription("Overview of all Vegito commands."),
  };

  export const leaderboard: VegitoCommand = {
    cooldown: 0,
    isProduction: true,
    name: "leaderboard",
    slash: () =>
      new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Find the Top Vegito Praisers and your own rank."),
  };

  export const praise: VegitoCommand = {
    cooldown: 60 * 60,
    isProduction: true,
    name: "praise",
    slash: () =>
      new SlashCommandBuilder()
        .setName("praise")
        .setDescription("Adore Lord Vegito."),
  };

  export const profile: VegitoCommand = {
    cooldown: 0,
    isProduction: true,
    name: "profile",
    slash: () =>
      new SlashCommandBuilder()
        .setName("profile")
        .setDescription(
          `Check out your profile status as a fellow Vegito praiser.`,
        ),
  };

  export const notify: VegitoCommand = {
    cooldown: 0,
    name: "notify",
    slash: () =>
      new SlashCommandBuilder()
        .setName("notify")
        .setDescription("Manage praise reminders.")
        .addSubcommand((sub) =>
          sub
            .setName("hourly")
            .setDescription("Enable or disable hourly reminder.")
            .addStringOption((option) =>
              option
                .setName("turn")
                .setDescription("Turn on or off hourly reminder")
                .setRequired(true)
                .addChoices(
                  { name: "on", value: "on" },
                  { name: "off", value: "off" },
                ),
            ),
        )
        .addSubcommand((sub) =>
          sub
            .setName("daily")
            .setDescription("Enable or disable daily reminder.")
            .addStringOption((option) =>
              option
                .setName("turn")
                .setDescription("Turn on or off hourly reminder")
                .setRequired(true)
                .addChoices(
                  { name: "on", value: "on" },
                  { name: "off", value: "off" },
                ),
            ),
        ),
    isProduction: true,
  };

  export const shop: VegitoCommand = {
    name: "shop",
    cooldown: 0,
    isProduction: false,
    slash: () =>
      new SlashCommandBuilder()
        .setName("shop")
        .setDescription("List shop items."),
  };

  export const buy: VegitoCommand = {
    name: "buy",
    cooldown: 0,
    isProduction: false,
    slash: () =>
      new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy Vegito shop items with Potara Coins.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Select an item to buy using their id or name")
            .setAutocomplete(true)
            .setRequired(true),
        ),
  };
}

export namespace SubCommandProperties {
  export const hourly: VegitoSubCommand = {
    name: "hourly",
    cooldown: 0,
    parent: CommandProperties.notify,
  };

  export const daily: VegitoSubCommand = {
    name: "daily",
    cooldown: 0,
    parent: CommandProperties.notify,
  };
}
