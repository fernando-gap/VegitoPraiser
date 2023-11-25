const { DataTypes, DatabaseError } = require("sequelize");
const User = require("./models/user.js");
const Property = require("./models/property.js");
const Schedule = require("./models/schedule.js");

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

module.exports = Model;