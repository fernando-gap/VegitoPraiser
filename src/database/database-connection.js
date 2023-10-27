const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const path = require("path");

try {
    const db = dotenv.config({ path: path.resolve(__dirname, "../../db.env")});

    if (db.error) {
        throw new Error("Could not load database configuration file");
    }
} catch (exception) {
    throw new Error("Database Configuration File is Missing", exception);
}

class DatabaseConnection {
    constructor() {
        this.connection = this.getConnection();
    }

    getConnection() {
        const sequelize = new Sequelize(
            process.env.MYSQL_DATABASE, 
            process.env.MYSQL_USER, 
            process.env.MYSQL_PASSWORD, 
            {
                host: process.env.MYSQL_HOST,
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
            throw new Error("Unable to connect to the database:", error);
        }
    }
}

module.exports = DatabaseConnection;