import { EmbedBuilder, bold } from "@discordjs/builders";
import { userMention } from "discord.js";
import bot from "../bot.js";
import { oneLine } from "common-tags";

class Job {
    constructor(name) {
        this.name = name;
    }
}

export class HourlyReminderPraiseJob extends Job {
    define(drive) {
        this.drive = drive;

        this.drive.define(this.name, async job => {
            const { user_id, channel_id } = job.attrs.data;
            const { praise } = bot.config.commands;

            const embed = new EmbedBuilder()
                .setColor(bot.config.colors.cerulean)
                .setDescription(oneLine`
                    Use </${praise.name}:${praise.id}> 
                    to unleash the power of Vegito, 
                    uniting us in celestial devotion.`
                );

            const channel = bot.client.channels.cache.get(channel_id);
            await channel.send({
                content: oneLine`
                    ${userMention(user_id)} Your ${bold("hourly")}
                    reminder is here, let your praise resound!
                `,
                embeds: [embed]
            });
        });
    }

    async exec(job) {
        job.unique({ "data.user_id": job.attrs.data.user_id });
        job.repeatEvery("1 hour", { skipImmediate: true });
        await job.save();
    }

    async reschedule(job, data) {
        await job.remove();
        const rescheduleJob = this.drive.create(this.name, data);
        this.exec(rescheduleJob);
    }
}

export class DailyReminderPraiseJob extends Job {
    define(drive) {
        this.drive = drive;

        this.drive.define(this.name, async job => {
            const { user_id, channel_id }= job.attrs.data;
            const { praise } = bot.config.commands;

            const embed = new EmbedBuilder()
                .setColor(bot.config.colors.cerulean)
                .setDescription(oneLine`
                    Use </${praise.name}:${praise.id}> 
                    to unleash the power of Vegito, 
                    uniting us in celestial devotion.
                `);

            const channel = bot.client.channels.cache.get(channel_id);
            await channel.send({
                content: oneLine`
                    ${userMention(user_id)} Your ${bold("daily")}
                    reminder is here, let your praise resound!
                `,
                embeds: [embed]
            });
        });
    }

    async exec(job) {
        job.repeatEvery("1 day", { skipImmediate: true });
        await job.save();
    }

    async reschedule(job, data) {
        await job.remove();
        const rescheduleJob = this.drive.create(this.name, data);
        this.exec(rescheduleJob);
    }
}

export class CooldownJob extends Job {
    define(drive) {
        this.drive = drive;

        this.drive.define(this.name, async job => {
            await job.remove();
        });
    }

    async exec(job) {
        job.unique({
            "data.user_id": job.attrs.data.user_id, 
            "data.commandName": job.attrs.data.commandName
        });
        job.priority("high");
        job.schedule(new Date(job.attrs.data.endDate));
        await job.save();
    }
}

/*
 * These are very specific made jobs.
 * It is not necessarily part of Vegito's core code.
 */

export class FortnightReminderJob extends Job {
    define(drive) {
        this.drive = drive;

        this.drive.define(this.name, async job => {
            const { channel_id } = job.attrs.data;
            const channel = bot.client.channels.cache.get(channel_id);
            await channel.send({
                content: oneLine`
                    @everyone Our lord and savior
                    vegito saved them from satan.
                `,
            });
        });
    }

    exec(data) {
        this.drive.every("14 days", this.name, data);
    }
}

export class QihaBumpReminder extends Job {
    define(drive) {
        this.drive = drive;

        this.drive.define(this.name, async job => {
            const { channel_id, user_id } = job.attrs.data;
            const channel = bot.client.channels.cache.get(channel_id);
            await channel.send({
                content: oneLine`
                    ${userMention(user_id)}, it is time to /bump!
                `,
            });
        });
    }

    exec(data) {
        this.drive.every("2 hours", this.name, data);
    }
}