import { DataTypes, DatabaseError } from "sequelize";
import User from "./models/user.js";
import Shop from "./models/shop.js";
import UserShopInventory from "./models/inventory.js";

class Model {
    constructor(connection) {
        if (connection !== undefined) {
            this.driver = connection;
        }
    }

    get User() {
        if (this.online()) {
            return User(this.driver, DataTypes);
        } else {
            throw new DatabaseError("Database has no active connection");
        }
    }

    get Shop() {
        if (this.online()) {
            return Shop(this.driver, DataTypes);
        } else {
            throw new DatabaseError("Database has no active connection");
        }
    }

    get UserShopInventory() {
        if (this.online()) {
            return UserShopInventory(this.driver, DataTypes);
        } else {
            throw new DatabaseError("Database has no active connection");
        }
    }


    async sync() {
        await this.User.sync();
        await this.Shop.sync();
        await this.UserShopInventory.sync();
    }
    
    online() {
        return this.driver !== undefined ? true : false;
    }
}

export default Model;