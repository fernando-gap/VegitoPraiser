import { Job } from "@hokify/agenda";
import { TextChannel } from "discord.js";
import Bot from "../../bot.js";
import { JobNotSetupVegitoError, RuntimeJobVegitoError } from "../../errors.js";
import { JobDataNotifyDailyPraise } from "../../interfaces.js";
import ViewJobNotifyDailyPraise from "../../views/view-job-notify-daily.js";
import JobVegito from "./job.js";

export default class JobNotifyDailyPraise extends JobVegito {
  constructor(name: string, bot: Bot) {
    super(name, bot);
  }

  protected override async handle(job: Job<any>): Promise<void> {
    const data: JobDataNotifyDailyPraise = job.attrs.data;

    if (this.bot === undefined)
      throw new JobNotSetupVegitoError(
        "bot instance",
        "the job needs a bot instance to function",
      );

    const channel = await this.bot.channels.fetch(data.channelId);

    if (channel === null) {
      /* maybe the channel got deleted ? */
      throw new RuntimeJobVegitoError(
        "channel not found",
        "This job needs a valid channel",
      );
    }

    if (channel instanceof TextChannel) {
      await channel.send(
        new ViewJobNotifyDailyPraise().frontend({ userId: data.userId }),
      );
    } else {
      throw new RuntimeJobVegitoError(
        "channel must be of type TextChannel",
        `${this.name} job requires text channel not ${channel}`,
      );
    }
  }

  async exec(job: Job<any>) {
    job.unique({ "data.userId": job.attrs.data.user_id });
    job.repeatEvery("1 day", { skipImmediate: true });
    await job.save();
  }
}
