module.exports = (driver, DataTypes) => {
    return driver.define("User", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        has_hourly_reminder: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        has_daily_reminder: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    });
};