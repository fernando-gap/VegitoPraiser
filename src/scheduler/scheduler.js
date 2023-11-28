const Bree = require("bree");
const path = require("path");
const DataAccessFactory = require("../database/data-access-factory");
const { EmbedBuilder, bold } = require("@discordjs/builders");

class Scheduler {
    constructor(db) {
        this.db = db;
        this.bree = new Bree({
            root: path.join(__dirname, "jobs"),
            /* asynchrounous function not being awaited, is it needed? */
            workerMessageHandler: (a, b) => {this.messageHandler(a, b);}
        });
    }

    async messageHandler(message) {
        const schedule = await DataAccessFactory.getSchedule(this.db);
        const jobs = await schedule.selectAll();

        if (message.message === "notify") {
            for (let i = 0; i < jobs.length; i++) {
                const job = jobs[i];

                if (job.has_hourly_reminder) {
                    await this.executePraiseReminderHourly(job);
                } else {
                    await this.executePraiseReminderDaily(job);
                }

            }
        } 
    }

    async executePraiseReminderDaily(job) {
        const dayInMs = 24 * 60 * 60 * 1000;
        const currentDate = new Date();
        currentDate.setSeconds(0, 0);
        job.last_praise.setSeconds(0, 0);

        console.log("job: ", job.last_praise, "current: ", currentDate, "subtraction: ", currentDate - job.last_praise, "dayMS: ", dayInMs);
        if (currentDate - job.last_praise >= dayInMs) {
            await this.sendReminderToChannel(job);
            job.last_praise.setYear(currentDate.getFullYear());
            job.last_praise.setDate(currentDate.getDate());
            job.changed("last_praise", true);
            await job.save();
        }
    }

    async executePraiseReminderHourly(job) {
        const hourInMs = 60 * 60 * 1000;
        const currentDate = new Date();
        currentDate.setSeconds(0, 0);
        job.last_praise.setSeconds(0, 0);

        if (currentDate - job.last_praise >= hourInMs) {
            await this.sendReminderToChannel(job);
            job.last_praise.setYear(currentDate.getFullYear());
            job.last_praise.setDate(currentDate.getDate());
            job.last_praise.setHours(job.last_praise.getHours()+1);
            job.changed("last_praise", true);
            await job.save();
        }
    }

    async sendReminderToChannel(job) {
        const notifyType = job.has_hourly_reminder ? "hourly" : "daily";
        const embed = new EmbedBuilder()
            .setColor(0x0047AB)
            .setDescription("Use `/praise` to unleash the power of Vegito, uniting us in celestial devotion.");

        const channel = this.client.channels.cache.get(job.channel_id);
        await channel.send({
            content: `<@${job.user_id}> Your ${bold(notifyType)} reminder is here, let your praise resound!`,
            embeds: [embed]
        });
    }

    async start(client) {
        this.client = client;
        await this.bree.start();
    }
}

module.exports = Scheduler;