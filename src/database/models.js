const { DataTypes, DatabaseError } = require("sequelize");

class Model {
    constructor(connection) {
        if (connection !== undefined) {
            this.driver = connection.driver;
        }
    }

    get User() {
        if (this.online()) {
            return this.driver.define("User", {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true
                }
            });
        } else {
            throw new DatabaseError("Database has no active connection");
        }
    }

    get Property() {
        if (this.online()) {
            return this.driver.define("Property", {
                name: {
                    primaryKey: true,
                    type: DataTypes.STRING,
                }
            });
        } else {
            throw new DatabaseError("Database has no active connection");
        }
    }

    get UserProperty() {
        if (this.online()) {
            return this.driver.define("UserProperty", {
                userId: {
                    type: DataTypes.STRING,
                    references: {
                        model: this.User,
                        key: "id"
                    }
                },
                propertyId: {
                    type: DataTypes.STRING,
                    references: {
                        model: this.Property,
                        key: "name"
                    }
                },
                value: {
                    type: DataTypes.TEXT
                }
            });
        } else {
            throw new DatabaseError("Database has no active connection");
        }
    }

    sync() {
        this.driver.sync({ force: process.NODE_ENV === "development" ? true : false });
    }
    
    online() {
        return this.driver !== undefined ? true : false;
    }
}

module.exports = Model;