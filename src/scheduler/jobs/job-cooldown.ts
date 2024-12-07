import { Job } from "@hokify/agenda";
import { JobDataCooldown } from "../../interfaces.js";
import JobVegito from "./job.js";

export default class JobCooldown extends JobVegito {
  protected override async handle(job: Job<any>): Promise<void> {
    await job.remove();
  }

  async exec(job: Job<any>) {
    const data: JobDataCooldown = job.attrs.data;

    job.unique({
      "data.userId": data.userId,
      "data.commandName": data.commandName,
    });

    job.priority("highest");
    job.schedule(new Date(data.endDate));
    await job.save();
  }
}
