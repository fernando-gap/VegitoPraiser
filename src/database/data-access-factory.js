import { DataAccessUser, DataAccessProperty, DataAccessSchedule } from "./data-access.js";
import bot from "../bot.js";

export class DataAccessFactory {
    static async getUser() {
        const db = DataAccessFactory.getDB();
        return new DataAccessUser(db);
    }

    static async getProperty() {
        const db = DataAccessFactory.getDB();
        return new DataAccessProperty(db);
    }

    static async getSchedule() {
        const db = DataAccessFactory.getDB();
        return new DataAccessSchedule(db);
    }

    static getDB() {
        return {
            db: bot.db,
            model: bot.model
        };
    }
}