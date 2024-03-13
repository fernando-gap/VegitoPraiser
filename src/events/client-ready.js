import { ActivityType } from "discord.js";

export default async readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    readyClient.user.setPresence({
        activities: [{
            name: "Honoring Akira Toriyama",
            type: ActivityType.Custom
        }],
        status: "online"
    });
};