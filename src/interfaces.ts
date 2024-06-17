import { EmbedBuilder } from "discord.js";
import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import ViewCooldown from "./views/view-cooldown.js";

/*
 * CONTEXT FOR VIEWS
 */

export interface Reply {
  content?: string;
  ephemeral?: boolean;
  embeds?: EmbedBuilder[];
}

export interface View {
  frontend(context: ContextRaw): Reply;
}

/*
 * Used when Context is unnecessary.
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContextRaw {}

export interface Context extends ContextRaw {
  userId: string;
}

export interface ContextInventory extends ContextRaw {
  name: string;
  avatarURL: string;
  delimiter: string;
  items: {
    amount: number;
    emoji: string;
  }[];
}

export interface ContextProfile extends Context {
  currentPraiseCount: number;
  currentPotaraCoins: number;
  avatarURL: string;
}

export interface ContextNotifyHourly extends Context {
  alreadyEnabled?: boolean;
  alreadyDisabled?: boolean;
  enable: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContextNotifyDaily extends ContextNotifyHourly {}

export interface CommandRaw {
  name: string;
  id: string;
  description: string;
}

export interface ContextLeaderboard extends ContextRaw {
  users: {
    id: string;
    praiseCount: string;
  }[];
}

export interface ContextCooldown extends ContextRaw {
  expiredTimestamp: number;
}

export interface ContextBuy extends ContextRaw {
  item: string | null;
  description?: {
    emoji: string;
    price: number;
    currentPotaraCoins: number;
    diff?: number;
  };
}

export interface ContextLofiJoin extends ContextRaw {
  channelId: string;
}

export interface ContextLofiLeave extends ContextRaw {
  exist: boolean;
}

export interface ContextSmirk extends ContextRaw {
  type: string | null;
  who: string | undefined;
}

/*
 * DATABASE
 */

export interface MySQLConfig {
  MYSQL_DATABASE: string;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MYSQL_HOST: string;
  MYSQL_PORT: number;
}

export interface ConnectionCache {
  sequelize?: Sequelize;
  hasCache: boolean;
}

export interface SchedulerMongoConfig {
  MONGO_INITDB_ROOT_USERNAME: string;
  MONGO_INITDB_ROOT_PASSWORD: string;
  MONGO_DB_HOST: string;
  MONGO_DB_PORT: number;
  MONGO_DB_AUTH_DATABASE: string;
}

/*
 * DATA ACCESS
 */

interface QueryOptions {
  query: any;
  extra: {
    transaction?: Transaction;
  };
}

export interface Select<T extends QueryOptions> {
  query?: T["query"];
  extra?: T["extra"];
}

export interface FindOneOptions extends QueryOptions {
  query: {
    where?: {
      id: string;
    };
    attributes?: string[];
  };
}

export interface IncrementOptions extends QueryOptions {
  extra: {
    transaction?: Transaction;
    incrementColumns: string[];
  };
}

export interface CreateUserOptions extends QueryOptions {
  query: {
    where: {
      id: string;
    };
  };
  extra: {
    transaction?: Transaction;
    defaults: {
      id: string;
      reminderId: number;
    };
  };
}

export interface CreateInventoryOptions extends QueryOptions {
  query: {
    where: {
      userId: string;
      shopId: string;
    };
  };
  extra: {
    transaction?: Transaction;
    defaults: {
      userId: string;
      shopId: number;
    };
  };
}

export interface UserItemsOptions extends QueryOptions {
  query: {
    where: {
      id: string;
    };
  };
  extra: {
    transaction: Transaction;
  };
}

export interface FindAllOptions extends QueryOptions {
  query: {
    limit?: number;
    order?: [[string, "ASC" | "DESC"]];
    offset?: number;
  };
}

export interface UpdateReminderOptions extends QueryOptions {
  extra: {
    transaction?: Transaction;
    newReminderId: number;
  };
}

export interface CreateOptions {
  transaction?: Transaction;
}

/* vegito commands */

export interface VegitoSubCommand {
  name: string;
  cooldown: number;
  parent: VegitoCommand;
}

export interface VegitoCommand {
  name: string;
  cooldown: number;
  isProduction: boolean;
  slash: () => any;
}

/*
 * Data for jobs
 */

export interface JobData {
  userId: string;
}

export interface JobDataCooldown extends JobData {
  commandName: string;
  endDate: number;
}

export interface JobDataNotifyHourlyPraise extends JobData {
  channelId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JobDataNotifyDailyPraise extends JobDataNotifyHourlyPraise {}

export interface CommandCooldown {
  view?: ViewCooldown;
  isCooldown: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
