const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

class DatabaseConnection {
    constructor() {
        this.driver = this.getConnection();
    }

    getConnection() {
        const prodconf = require("dotenv").parse(fs.readFileSync(path.resolve(__dirname, "../../db_prod.env")));
        const sequelize = new Sequelize(
            prodconf.MYSQL_DATABASE, 
            prodconf.MYSQL_USER, 
            prodconf.MYSQL_PASSWORD, 
            {
                host: prodconf.MYSQL_HOST,
                port: prodconf.MYSQL_PORT,
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
        this.driver = this.getConnection();
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
            await this.driver.authenticate();
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