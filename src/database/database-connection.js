import { Sequelize } from "sequelize";
import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";

class DatabaseConnection {
    constructor() {

        if (process.env.NODE_ENV === "production") {
            this.config = dotenv.parse(readFileSync(resolve(import.meta.dirname, "../../db_prod.env")));
        } else {
            this.config = dotenv.parse(readFileSync(resolve(import.meta.dirname, "../../db_dev.env")));
        }

        this.driver = this.getConnection();
    }

    async isOnline() {
        try {
            await this.driver.authenticate();
            return true;
        } catch (error) {
            throw new Error("Unable to connect to the database:", error);
        }
    }
}

export class DatabaseConnectionProduction extends DatabaseConnection {
    getConnection() {
        const sequelize = new Sequelize(
            this.config.MYSQL_DATABASE, 
            this.config.MYSQL_USER, 
            this.config.MYSQL_PASSWORD, 
            {
                host: this.config.MYSQL_HOST,
                port: this.config.MYSQL_PORT,
                dialect: "mysql",
                define: {
                    freezeTableName: true
                }
            }
        );
        return sequelize;
    }
}

export class DatabaseConnectionDevelopment extends DatabaseConnection {
    getConnection() {
        const sequelize = new Sequelize(
            this.config.MYSQL_DATABASE, 
            this.config.MYSQL_USER, 
            this.config.MYSQL_PASSWORD, 
            {
                host: this.config.MYSQL_HOST,
                port: this.config.MYSQL_PORT,
                dialect: "mysql",
                define: {
                    freezeTableName: true
                }
            },
        );
        return sequelize;
    }
}