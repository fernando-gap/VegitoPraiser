import { DataTypes, DatabaseError } from "sequelize";
import User from "./models/user.js";
import Property from "./models/property.js";

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

    get Property() {
        if (this.online()) {
            return Property(this.driver, DataTypes);
        } else {
            throw new DatabaseError("Database has no active connection");
        }
    }

    async sync() {
        await this.User.sync();
        await this.Property.sync();
    }
    
    online() {
        return this.driver !== undefined ? true : false;
    }
}

export default Model;