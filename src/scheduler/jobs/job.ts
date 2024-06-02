import { Agenda, Job } from "@hokify/agenda";
import { JobNotSetupVegitoError, NotSchedulableJobVegitoError, RuntimeJobVegitoError } from "../../errors.js";
import { JobData } from "../../interfaces.js";
import Bot from "../../bot.js";
import { DataAccessUser } from "../../database/data-access.js";
import { ReminderType } from "../../enums.js";
import User from "../../database/models/user.js";
import { Debug } from "../../debug.js";
import { QueryReturn } from "../../types.js";

export default abstract class JobVegito {
    scheduler!: Agenda;
    protected userDAO: DataAccessUser;
    protected user!: QueryReturn<User> | null;

    constructor(public name: string, protected bot: Bot) {
        this.userDAO = new DataAccessUser(bot.db);
    }

    define(scheduler: Agenda): void {
        this.scheduler = scheduler;
        this.scheduler.define(this.name, async job => {
            if (this.bot === undefined)
                throw new JobNotSetupVegitoError("bot instance", "the job needs a bot instance to function")

            this.user = await this.userDAO.selectOne({
                query: {
                    where: {
                        id: job.attrs.data.userId
                    }
                }
            })

            if (this.user === null) {
                throw new RuntimeJobVegitoError("jobs needs valid users", "the user id for job does not exist or is invalid")
            }

            /* it removes itself because user can only have one job */
            if (this.user.reminderId === ReminderType.DISABLED || this.user.reminderId !== ReminderType.HOURLY) {
                Debug.log("job removing itself")
                await job.remove();
                return;
            }


            await this.handle(job)
        });
    };

    protected abstract handle(job: Job<any>): Promise<void>;
    abstract exec(job: Job<any>): Promise<void>;
    async reschedule(_job: Job<any>, _data: JobData): Promise<void> {
        throw new NotSchedulableJobVegitoError("scheduler", "the job don't override reschedule");
    }
}