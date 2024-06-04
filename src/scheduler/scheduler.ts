import { Agenda, Job } from "@hokify/agenda";
import { oneLineTrim } from "common-tags";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Debug } from "../debug.js";
import { JobNotSetupVegitoError, RuntimeJobVegitoError } from "../errors.js";
import { JobData, SchedulerMongoConfig } from "../interfaces.js";
import JobVegito from "./jobs/job.js";

export default class Scheduler {
  readonly #path: string;
  private jobs = new Map<string, JobVegito>();
  drive: Agenda;

  private loadConfig(): SchedulerMongoConfig {
    const envs = readFileSync(this.#path);
    const config: any = dotenv.parse(envs);
    return config;
  }

  constructor(path: string) {
    this.#path = resolve(import.meta.dirname, path);
    const config = this.loadConfig();

    const mongoURL = oneLineTrim`
            mongodb://
            ${config.MONGO_INITDB_ROOT_USERNAME}:
            ${config.MONGO_INITDB_ROOT_PASSWORD}@
            ${config.MONGO_DB_HOST}:
            ${config.MONGO_DB_PORT}/
            ${config.MONGO_DB_AUTH_DATABASE}
        `;

    this.drive = new Agenda({
      db: { address: mongoURL },
      ensureIndex: true,
    });
  }

  add(job: JobVegito) {
    job.define(this.drive);
    this.jobs.set(job.name, job);
  }

  async create(name: string, data: JobData) {
    const job = this.jobs.get(name);

    if (job === undefined) {
      throw new JobNotSetupVegitoError(
        `${name} job not found`,
        "the job does not exist",
      );
    }
    const jobInstance = this.drive.create(name, data);
    await job.exec(jobInstance);
  }

  async reschedule(name: string, newData: any) {
    const job = this.jobs.get(name);
    if (job === undefined)
      throw new JobNotSetupVegitoError(
        "job is undefined",
        "job was not set up with `add`",
      );

    const oldJob: Job<any>[] = await this.drive.jobs({
      name: name,
      "data.user_id": newData.user_id,
    });

    await job.reschedule(oldJob[0], { ...oldJob[0].attrs.data, ...newData });
  }

  async delete(name: string, data: JobData) {
    const jobInstance = await this.drive.jobs({
      name: name,
      "data.userId": data.userId,
    });
    if (jobInstance.length > 0) await jobInstance[0].remove();
    else
      throw new RuntimeJobVegitoError(
        "job delete",
        "cannot delete a job that doesn't exist",
      );
  }

  async start() {
    this.drive.on("fail", (err, job) => {
      Debug.error("scheduler error", err, job);
    });

    await this.drive.start();
  }
}
