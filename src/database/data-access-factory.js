import { DataAccessUser, DataAccessShop, DataAccessInventory } from "./data-access.js";

export class DataAccessFactory {
    static async getUser(db) {
        return new DataAccessUser(db, "User");
    }

    static async getShop(db) {
        return new DataAccessShop(db, "Shop");
    }

    static async getInventory(db) {
        return new DataAccessInventory(db, "UserShopInventory");
    }
}
