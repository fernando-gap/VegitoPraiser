const { DataAccessUser, DataAccessProperty, DataAccessSchedule } = require("./data-access.js");

class DataAccessFactory {
    static async getUser(db) {
        return new DataAccessUser(db);
    }

    static async getProperty(db) {
        return new DataAccessProperty(db);
    }

    static async getSchedule(db) {
        return new DataAccessSchedule(db);
    }
}

module.exports = DataAccessFactory;
