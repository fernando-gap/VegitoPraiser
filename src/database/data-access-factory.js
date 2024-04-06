import { DataAccessUser } from "./data-access.js";

export class DataAccessFactory {
    static async getUser(db) {
        return new DataAccessUser(db, "User");
    }
}
