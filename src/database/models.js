const { DataTypes } = require("sequelize");

module.exports = async (db) => {
    const model = {};
    model.User = db.connection.define("User", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    });

    model.Property = db.connection.define("Property", {
        name: {
            primaryKey: true,
            type: DataTypes.STRING,
        }
    });

    model.UserProperty = db.connection.define("UserProperty", {
        userId: {
            type: DataTypes.STRING,
            references: {
                model: model.User,
                key: "id"
            }
        },
        propertyId: {
            type: DataTypes.STRING,
            references: {
                model: model.Property,
                key: "name"
            }
        },
        value: {
            type: DataTypes.TEXT
        }
    });

    return model;
};