import dotenv from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Sequelize } from "sequelize-typescript";
import { Debug } from "../debug.js";
import { DatabaseSetupVegitoError } from "../errors.js";
import { ConnectionCache, MySQLConfig } from "../interfaces.js";

export abstract class DatabaseConnection {
  readonly #path: string;

  constructor(path: string) {
    this.#path = resolve(import.meta.dirname, path);
    Debug.log("DatabaseConnection Path", this.#path);
  }

  public getConnection(): Sequelize {
    const { sequelize, hasCache } = this.getCache();

    if (hasCache) {
      if (sequelize) return sequelize;
      else
        throw new DatabaseSetupVegitoError(
          "getConnection",
          "Connection is cached but sequelize is undefined",
        );
    }
    return this.createConnection();
  }

  protected abstract createConnection(): Sequelize;
  protected abstract getCache(): ConnectionCache;

  protected loadConfig(): MySQLConfig {
    const envs = readFileSync(this.#path);
    const config: any = dotenv.parse(envs);
    return config;
  }
}

export class DatabaseConnectionProduction extends DatabaseConnection {
  static cache: ConnectionCache = { hasCache: false };

  protected override getCache(): ConnectionCache {
    return DatabaseConnectionProduction.cache;
  }
  public override createConnection(): Sequelize {
    const config = this.loadConfig();

    const sequelize = new Sequelize(
      config.MYSQL_DATABASE,
      config.MYSQL_USER,
      config.MYSQL_PASSWORD,
      {
        host: config.MYSQL_HOST,
        port: config.MYSQL_PORT,
        dialect: "mysql",
        define: {
          freezeTableName: true,
        },
        logging: (sql) => Debug.log(sql),
      },
    );
    DatabaseConnectionProduction.cache.sequelize = sequelize;
    DatabaseConnectionProduction.cache.hasCache = true;
    return sequelize;
  }
}

export class DatabaseConnectionDevelopment extends DatabaseConnection {
  static cache: ConnectionCache = { hasCache: false };
  protected override getCache(): ConnectionCache {
    return DatabaseConnectionDevelopment.cache;
  }

  public override createConnection(): Sequelize {
    const config = this.loadConfig();

    const sequelize = new Sequelize(
      config.MYSQL_DATABASE,
      config.MYSQL_USER,
      config.MYSQL_PASSWORD,
      {
        host: config.MYSQL_HOST,
        port: config.MYSQL_PORT,
        dialect: "mysql",
        define: {
          freezeTableName: true,
        },
      },
    );
    DatabaseConnectionDevelopment.cache.sequelize = sequelize;
    DatabaseConnectionDevelopment.cache.hasCache = true;
    return sequelize;
  }
}
