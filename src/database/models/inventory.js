export default (driver, DataTypes) => {
    return driver.define("UserShopInventory", {
        item_code: {
            type: DataTypes.STRING,
            references: {
                model: "Shop",
                key: "code"
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        },
        user_id: {
            type: DataTypes.STRING,
            references: {
                model: "User",
                key: "id"
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        }
    }, { timestamps: false });
};