const { DataAccessUser, DataAccessUserProperty, DataAccessProperty } = require("./data-access.js");

class DataAccessFactory {
    static async getUser(db) {
        return new DataAccessUser(db);
    }
    static async getUserProperty(db) {
        return new DataAccessUserProperty(db);
    }

    static async getProperty(db) {
        return new DataAccessProperty(db);
    }
}

module.exports = DataAccessFactory;
