const { DataAccessUser } = require("./data-access.js");

class DataAccessFactory {
    static async getUser(db) {
        return new DataAccessUser(db);
    }
}

module.exports = DataAccessFactory;
