import { Sequelize } from "sequelize";
import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";

class DatabaseConnection {
    load_config(path) {
        return dotenv.parse(
            readFileSync(
                resolve(import.meta.dirname, path)
            )
        );
    }
}

export class DatabaseConnectionProduction extends DatabaseConnection {
    getConnection(path) {
        const config = this.load_config(path);
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
                logging: false
            },
        );
        return sequelize;
    }
}

/**
 * The getConnection can change, respect SRP.
 */
export class DatabaseConnectionDevelopment extends DatabaseConnection {
    getConnection(path) {
        const config = this.load_config(path);
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