import { Sequelize } from "sequelize-typescript";
import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";
import { Debug } from "../debug.js";
import { ConnectionCache, MySQLConfig } from "../interfaces.js";

export abstract class DatabaseConnection {
    readonly #path: string;
    static cache: ConnectionCache = { hasCache: false };

    constructor(path: string) {
        this.#path = resolve(import.meta.dirname, path)
        Debug.log("DatabaseConnection Path", this.#path);
    }

    public getConnection(): ConnectionCache {
        if (DatabaseConnection.cache.sequelize === undefined) {
            DatabaseConnection.cache.sequelize = this.createConnection();
            DatabaseConnection.cache.hasCache = false;
        } else {
            DatabaseConnection.cache.hasCache = true;
        }

        return DatabaseConnection.cache;
    };

    protected abstract createConnection(): Sequelize;

    protected loadConfig(): MySQLConfig {
        const envs = readFileSync(this.#path);
        const config: any = dotenv.parse(envs);
        return config;
    }
}

export class DatabaseConnectionProduction extends DatabaseConnection {
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
                    freezeTableName: true
                },
                logging: false,
            },
        );
        return sequelize;
    }
}


export class DatabaseConnectionDevelopment extends DatabaseConnection {
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
                    freezeTableName: true
                }
            },
        );
        return sequelize;
    }
}