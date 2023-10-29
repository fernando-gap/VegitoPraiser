const { DataAccessUser } = require("./data-access.js");

class DataAccessFactory {
    static async getUser(db) {
        console.log(db);
        return new DataAccessUser(db);
    }
}

module.exports = DataAccessFactory;
