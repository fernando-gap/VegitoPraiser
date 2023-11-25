module.exports = (driver, DataTypes) => {
    return driver.define("User", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    });
};