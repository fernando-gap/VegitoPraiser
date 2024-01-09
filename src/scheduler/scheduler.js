const path = require("path");
const fs = require("fs");
const { Agenda } = require("@hokify/agenda");

class Scheduler {
    constructor(bot) {
        let config = {};
        if (process.env.NODE_ENV === "production") {
            config = require("dotenv").parse(fs.readFileSync(path.resolve(__dirname, "../../db_scheduler_prod.env")));
        } else {
            config = require("dotenv").parse(fs.readFileSync(path.resolve(__dirname, "../../db_scheduler_dev.env")));
        }

        this.bot = bot;
        this.jobs = new Map();
        const mongoURL = `mongodb://${config.MONGO_INITDB_ROOT_USERNAME}:${config.MONGO_INITDB_ROOT_PASSWORD}@${config.MONGO_DB_HOST}:${config.MONGO_DB_PORT}/${config.MONGO_DB_AUTH_DATABASE}`;
        this.drive = new Agenda({ db: { address: mongoURL }, ensureIndex: true });
    }

    add(job) {
        job.define(this.drive, this.bot);
        this.jobs.set(job.name, job);
    }

    async create(name, data) {
        const job = this.jobs.get(name);
        const jobInstance = this.drive.create(name, data);
        await job.exec(jobInstance);
    }

    createSingle(name, data) {
        const job = this.jobs.get(name);
        job.exec(data);
    }

    async reschedule(name, newData) {
        const job = this.jobs.get(name);
        const oldJob = await this.drive.jobs({ name: name, "data.user_id": newData.user_id});
        await job.reschedule(oldJob[0], { ...oldJob[0].attrs.data, ...newData});
    }

    async delete(name, data) {
        const jobInstance = await this.drive.jobs({ name: name, "data.user_id": data.user_id});
        await jobInstance[0].remove();
    }

    async start() {
        this.drive.on("fail", (err, job) => {
            console.log(err, job);
        });

        await this.drive.start();
    }
}

module.exports = Scheduler;