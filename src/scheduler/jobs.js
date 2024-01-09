const { EmbedBuilder, bold } = require("@discordjs/builders");

class Job {
    constructor(name) {
        this.name = name;
    }
}

class HourlyReminderPraiseJob extends Job {
    define(drive, bot) {
        this.drive = drive;
        this.bot = bot;

        this.drive.define(this.name, async job => {
            const { user_id, channel_id } = job.attrs.data;
            const { praise } = this.bot.config.commands;

            const embed = new EmbedBuilder()
                .setColor(this.bot.config.colors.cerulean)
                .setDescription(`Use </${praise.name}:${praise.id}> to unleash the power of Vegito, uniting us in celestial devotion.`);

            const channel = this.bot.client.channels.cache.get(channel_id);
            await channel.send({
                content: `<@${user_id}> Your ${bold("hourly")} reminder is here, let your praise resound!`,
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

class DailyReminderPraiseJob extends Job {
    define(drive, bot) {
        this.drive = drive;
        this.bot = bot;

        this.drive.define(this.name, async job => {
            const { user_id, channel_id }= job.attrs.data;
            const { praise } = this.bot.config.commands;

            const embed = new EmbedBuilder()
                .setColor(this.bot.config.colors.cerulean)
                .setDescription(`Use </${praise.name}:${praise.id}> to unleash the power of Vegito, uniting us in celestial devotion.`);

            const channel = this.bot.client.channels.cache.get(channel_id);
            await channel.send({
                content: `<@${user_id}> Your ${bold("daily")} reminder is here, let your praise resound!`,
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

class CooldownJob extends Job {
    define(drive, bot) {
        this.drive = drive;
        this.bot = bot;

        this.drive.define(this.name, async job => {
            await job.remove();
        });
    }

    async exec(job) {
        job.schedule("in 1 hour");
        job.unique({"data.user_id": job.attrs.data.user_id});
        job.priority("high");
        await job.save();
    }
}

/*
 * These are very specific made jobs.
 * It is not necessarily part of Vegito's core code.
 */

class FortnightReminderJob extends Job {
    define(drive, bot) {
        this.drive = drive;
        this.bot = bot;

        this.drive.define(this.name, async job => {
            const { channel_id } = job.attrs.data;
            const channel = this.bot.client.channels.cache.get(channel_id);
            console.log(channel);
            await channel.send({
                content: "@everyone Our lord and savior vegito saved them from satan.",
            });
        });
    }

    exec(data) {
        this.drive.every("14 days", this.name, data);
    }
}

module.exports = {
    HourlyReminderPraiseJob,
    DailyReminderPraiseJob,
    FortnightReminderJob,
    CooldownJob
};