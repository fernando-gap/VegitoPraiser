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
            const p = this.driver.define("Property", {
                praise_count: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                }
            }, {
                timestamps: false
            });

            this.User.hasOne(p, {
                foreignKey: {
                    name: "user_id",
                    type: DataTypes.STRING,
                    unique: "fk_unique"
                }
            });

            return p;
        } else {
            throw new DatabaseError("Database has no active connection");
        }
    }

    get UserProperty() {
        throw new Error("Property is Deprecated");
    }

    async sync() {
        await this.User.sync();
        await this.Property.sync();
    }
    
    online() {
        return this.driver !== undefined ? true : false;
    }
}

module.exports = Model;