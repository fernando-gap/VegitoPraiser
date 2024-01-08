const { EmbedBuilder, bold } = require("@discordjs/builders");

class HourlyReminderPraiseJob {
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
        // ensures that the user_id is the same as the old job
        data.user_id = job.attrs.data.user_id; 

        await job.remove();
        const rescheduleJob = this.drive.create(this.name, data);
        this.exec(rescheduleJob);
    }
}

class DailyReminderPraiseJob {
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
        // ensures that the user_id is the same as the old job
        data.user_id = job.attrs.data.user_id; 

        await job.remove();
        const rescheduleJob = this.drive.create(this.name, data);
        this.exec(rescheduleJob);
    }
}

module.exports = {
    HourlyReminderPraiseJob,
    DailyReminderPraiseJob
};