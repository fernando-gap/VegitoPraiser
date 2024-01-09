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
        console.log(mongoURL);
        this.drive = new Agenda({ db: { address: mongoURL }, ensureIndex: true });
    }

    add(job) {
        job.define(this.drive, this.bot);
        this.jobs.set(job.name, job);
    }

    async create(name, data) {
        const job = this.jobs.get(name);
        const jobInstance = this.drive.create(name, data);
        console.log(this.jobs, job, jobInstance);
        await job.exec(jobInstance);
    }

    async reschedule(name, newData) {
        const job = this.jobs.get(name);
        const oldJob = await this.drive.jobs({ name: name, "data.user_id": newData.user_id});
        console.log({ ...oldJob[0].attrs.data, ...newData});
        await job.reschedule(oldJob[0], { ...oldJob[0].attrs.data, ...newData});
    }

    async delete(name, data) {
        const jobInstance = await this.drive.jobs({ name: name, "data.user_id": data.user_id});
        console.log(jobInstance[0]);
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