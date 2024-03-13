import User from "./user.js";

export default (driver, DataTypes) => {
    const modelInventory = driver.define("Inventory", {
        /* what channel the user enabled the notification system */
        store_item: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    User(driver, DataTypes).belongsToMany(modelInventory, {
        foreignKey: {
            name: "user_id",
            type: DataTypes.STRING
        }
    });

    return modelInventory;
};