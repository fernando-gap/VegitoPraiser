import User from "./user.js";

export default (driver, DataTypes) => {
    const modelProperty = driver.define("Property", {
        praise_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: false
    });

    User(driver, DataTypes).hasOne(modelProperty, {
        foreignKey: {
            name: "user_id",
            type: DataTypes.STRING,
            unique: "fk_unique_property"
        }
    });

    return modelProperty;
};