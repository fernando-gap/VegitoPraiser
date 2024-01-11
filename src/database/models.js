import { DataTypes, DatabaseError } from "sequelize";
import User from "./models/user.js";
import Property from "./models/property.js";
import Schedule from "./models/schedule.js";

class Model {
    constructor(connection) {
        if (connection !== undefined) {
            this.driver = connection.driver;
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

    get Schedule() {
        if (this.online()) {
            return Schedule(this.driver, DataTypes);
        } else {
            throw new DatabaseError("Database has no driver connenction");
        }
    }

    async sync() {
        await this.User.sync();
        await this.Property.sync();
        await this.Schedule.sync();
    }
    
    online() {
        return this.driver !== undefined ? true : false;
    }
}

export default Model;