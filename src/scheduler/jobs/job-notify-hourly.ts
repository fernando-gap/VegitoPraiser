import { Job } from "@hokify/agenda";
import JobVegito from "./job.js";
import { JobDataNotifyHourlyPraise } from "../../interfaces.js";
import Bot from "../../bot.js";
import { RuntimeJobVegitoError } from "../../errors.js";
import { TextChannel } from "discord.js";
import ViewJobNotifyHourlyPraise from "../../views/view-job-notify-hourly.js";
import { DataAccessUser } from "../../database/data-access.js";


export default class JobNotifyHourlyPraise extends JobVegito {
    constructor(name: string, bot: Bot) {
        super(name, bot);
        this.userDAO = new DataAccessUser(bot.db)
    }

    protected override async handle(job: Job<any>): Promise<void> {
        const data: JobDataNotifyHourlyPraise = job.attrs.data;
        const channel = await this.bot.channels.fetch(data.channelId);

        if (channel === null) {
            /* maybe the channel got deleted ? */
            throw new RuntimeJobVegitoError("channel not found", "This job needs a valid channel");
        }

        if (channel instanceof TextChannel) {
            await channel.send(new ViewJobNotifyHourlyPraise().frontend({ userId: data.userId }))
        } else {
            throw new RuntimeJobVegitoError("channel must be of type TextChannel", `${this.name} job requires text channel not ${channel}`)
        }
    }

    async exec(job: Job<any>) {
        job.unique({ "data.userId": job.attrs.data.user_id });
        job.repeatEvery("1 hour", { skipImmediate: true });
        await job.save();
    }
}
