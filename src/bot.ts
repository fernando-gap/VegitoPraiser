import { Client } from "discord.js";
import { Sequelize } from "sequelize-typescript";
import {
  DatabaseConnection,
  DatabaseConnectionDevelopment,
  DatabaseConnectionProduction,
} from "./database/database-connection.js";
import Inventory from "./database/models/inventory.js";
import Reminder from "./database/models/reminder.js";
import Shop from "./database/models/shop.js";
import User from "./database/models/user.js";
import { Debug } from "./debug.js";
import {
  DatabaseConnectionVegitoError,
  DatabaseSetupVegitoError,
  IncorrectEnvironmentVegitoError,
} from "./errors.js";
import JobCooldown from "./scheduler/jobs/job-cooldown.js";
import JobNotifyDailyPraise from "./scheduler/jobs/job-notify-daily.js";
import JobNotifyHourlyPraise from "./scheduler/jobs/job-notify-hourly.js";
import Scheduler from "./scheduler/scheduler.js";

export default class Bot extends Client {
  scheduler!: Scheduler;
  isDevInteraction = true;
  db!: Sequelize;
  private dbprod?: Sequelize;
  private dbdev?: Sequelize;

  async init() {
    let connection: DatabaseConnection;

    if (this.isProd()) {
      connection = new DatabaseConnectionProduction("../../db_prod.env");
      this.scheduler = new Scheduler("../../db_scheduler_prod.env");
      this.isDevInteraction = false;
      Debug.disable();
    } else if (this.isDev()) {
      connection = new DatabaseConnectionDevelopment("../../db_dev.env");
      this.scheduler = new Scheduler("../../db_scheduler_dev.env");
    } else {
      throw new IncorrectEnvironmentVegitoError(
        "Incorrect Node Env",
        "Expected production or development",
      );
    }

    await this.setupDatabase(connection);
    Debug.status(`${process.env.NODE_ENV} database is ready`);
    await this.setupScheduler();
    Debug.status(`${process.env.NODE_ENV} database is ready`);
  }

  private async setupDatabase(connection: DatabaseConnection) {
    try {
      const { sequelize, hasCache: isCache } = connection.getConnection();
      if (sequelize === undefined) {
        throw new DatabaseConnectionVegitoError(
          "Connection Error",
          "Cache value is undefined",
        );
      }

      if (connection instanceof DatabaseConnectionDevelopment) {
        this.dbdev = sequelize;
        this.dbdev.sync({ alter: true });
        this.db = this.dbdev;
      } else {
        this.dbprod = sequelize;
        this.db = this.dbprod;
      }

      if (!isCache) {
        this.db.addModels([User, Reminder, Shop, Inventory]);
      }
    } catch (e) {
      throw new DatabaseSetupVegitoError(
        "Database Setup Error",
        "sequelize connection failed or database is down",
        { cause: e },
      );
    }
  }

  isProd(): boolean {
    return process.env.NODE_ENV === "production";
  }

  isDev(): boolean {
    return process.env.NODE_ENV === "development";
  }

  async setupScheduler() {
    this.scheduler.add(new JobNotifyHourlyPraise("notifyHourlyPraise", this));
    this.scheduler.add(new JobNotifyDailyPraise("notifyDailyPraise", this));
    this.scheduler.add(new JobCooldown("cooldown", this));

    await this.scheduler.start();
  }

  async connectDev() {
    if (this.dbdev === undefined) {
      await this.setupDatabase(
        new DatabaseConnectionDevelopment("../../db_dev.env"),
      );
      this.db = this.dbdev!;
    } else {
      this.db = this.dbdev;
    }
  }

  async connectProd() {
    if (this.dbprod === undefined) {
      await this.setupDatabase(
        new DatabaseConnectionDevelopment("../../db_dev.env"),
      );
      this.db = this.dbprod!;
    } else {
      this.db = this.dbprod;
    }
  }
}
