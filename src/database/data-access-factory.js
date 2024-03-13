import { DataAccessUser, DataAccessProperty } from "./data-access.js";

export class DataAccessFactory {
    static async getUser(db) {
        return new DataAccessUser(db, "User");
    }

    static async getProperty(db) {
        return new DataAccessProperty(db, "Property");
    }
}
