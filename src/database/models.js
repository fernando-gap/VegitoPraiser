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
                    unique: "fk_unique_property"
                }
            });

            return p;
        } else {
            throw new DatabaseError("Database has no active connection");
        }
    }

    get Schedule() {
        if (this.online()) {
            const s = this.driver.define("Schedule", {
                channel_id: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                last_praise: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                    allowNull: false
                }
            }, {
                timestamps: false
            });
            this.User.hasOne(s, {
                foreignKey: {
                    name: "user_id",
                    type: DataTypes.STRING,
                    unique: "fk_unique_schedule"
                }
            });

            return s;
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