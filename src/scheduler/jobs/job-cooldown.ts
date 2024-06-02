import { Job } from "@hokify/agenda";
import JobVegito from "./job.js";
import { JobDataCooldown } from "../../interfaces.js";


export default class JobCooldown extends JobVegito {
    protected override async handle(job: Job<any>): Promise<void> {
        await job.remove();
    }

    async exec(job: Job<any>) {
        const data: JobDataCooldown = job.attrs.data;

        job.unique({
            "data.userId": data.userId, 
            "data.commandName": data.commandName
        });

        job.priority("high");
        job.schedule(new Date(data.endDate));
        await job.save();
    }
}