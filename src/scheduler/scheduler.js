const Bree = require("bree");
const path = require("path");
const DataAccessFactory = require("../database/data-access-factory");

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
        if (message.message === "notify") {
            await this.executePraiseReminder();
        }
    }

    async executePraiseReminder() {
        const dayInMs = 24 * 60 * 60 * 1000;
        const schedule = await DataAccessFactory.getSchedule(this.db);
        const jobs = await schedule.selectAll();

        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            const currentDate = new Date();
            currentDate.setSeconds(0, 0);
            job.last_praise.setSeconds(0, 0);

            if (currentDate - job.last_praise >= dayInMs) {
                const channel = this.client.channels.cache.get(job.channel_id);
                await channel.send(`<@${job.user_id}>, *let your praise resound!* \n\nUnleash your admiration with the mighty command\n* \`/praise\`\nand together, we'll reach new heights of power.\n\n *The more you praise, the stronger we become!*`);

                /*TODO: you have to update the user date to currentDate so the next day can work */
                console.log("before: ", job.last_praise);
                job.last_praise = job.last_praise.setDate(job.last_praise.getDate()+1);
                console.log("after: ", job.last_praise);
                job.changed("last_praise", true);
                await job.save();
            }
        }
    }

    async start(client) {
        this.client = client;
        await this.bree.start();
    }
}

module.exports = Scheduler;