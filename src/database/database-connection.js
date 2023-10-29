const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

class DatabaseConnection {
    constructor() {
        this.driver = this.getConnection();
    }

    getConnection() {
        const sequelize = new Sequelize(
            process.env.MYSQL_DATABASE, 
            process.env.MYSQL_USER, 
            process.env.MYSQL_PASSWORD, 
            {
                host: process.env.MYSQL_HOST,
                port: process.env.MYSQL_PORT,
                dialect: "mysql"
            }
        );
        return sequelize;
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

class DatabaseConnectionDev {
    constructor() {
        this.connection = this.getConnection();
    }

    getConnection() {
        const devconf = require("dotenv").parse(fs.readFileSync(path.resolve(__dirname, "../../db_dev.env")));
        const sequelize = new Sequelize(
            devconf.MYSQL_DATABASE, 
            devconf.MYSQL_USER, 
            devconf.MYSQL_PASSWORD, 
            {
                host: devconf.MYSQL_HOST,
                port: devconf.MYSQL_PORT,
                dialect: "mysql"
            }
        );
        return sequelize;
    }

    async isOnline() {
        try {
            await this.connection.authenticate();
            return true;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to connect to the database:", error);
        }
    }
}

module.exports = {
    DatabaseConnection, 
    DatabaseConnectionDev
};