import { ActivityType, Events, GatewayIntentBits } from "discord.js";
import Bot from "./bot.js";
import {
  CommandProperties,
  SubCommandProperties,
} from "./commands/commands.js";
import Help from "./commands/help.js";
import Leaderboard from "./commands/leaderboard.js";
import Daily from "./commands/notify/daily.js";
import Hourly from "./commands/notify/hourly.js";
import Notify from "./commands/notify/notify.js";
import Praise from "./commands/praise.js";
import Profile from "./commands/profile.js";
import Buy from "./commands/shop/buy.js";
import Shop from "./commands/shop/shop.js";
import config from "./config.js";
import { Debug } from "./debug.js";
import VegitoEvent from "./events.js";
import { VegitoCommand } from "./interfaces.js";

(async () => {
  const bot = new Bot({ intents: [GatewayIntentBits.Guilds] });
  await bot.init();

  bot.once(Events.ClientReady, (readyClient) => {
    Debug.status(`Ready! Logged in as ${readyClient.user.tag}`);
    readyClient.user.setPresence({
      activities: [
        {
          name: "The honour is to Vegito.",
          type: ActivityType.Custom,
        },
      ],
      status: "online",
    });
  });

  const commands: VegitoEvent<VegitoCommand>[] = [
    new Praise(bot, CommandProperties.praise),
    new Profile(bot, CommandProperties.profile),
    new Help(bot, CommandProperties.help),
    new Leaderboard(bot, CommandProperties.leaderboard),
    new Shop(bot, CommandProperties.shop),
    new Buy(bot, CommandProperties.buy),
  ];

  for (const command of commands) {
    command.setUp();
  }

  new Notify(bot, CommandProperties.notify).setUp([
    new Hourly(bot, SubCommandProperties.hourly),
    new Daily(bot, SubCommandProperties.daily),
  ]);

  await bot.login(config.token);
})();
