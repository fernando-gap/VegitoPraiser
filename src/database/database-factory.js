const { DatabaseUser, Database } = require("./database.js");
const DatabaseConnection = require("./database-connection.js");

class DatabaseFactory {
    static database = [];

    static async getUser() {
        return await this._cache(
            new DatabaseUser(new DatabaseConnection()), 
            DatabaseUser
        );
    }

    static async _cache(command, databaseType) {
        if (this.database.length <= 0) {
            await command.db.isOnline();
            this.database.push(command);
            return command;
        } else {
            for (const db of this.database) {
                if (db instanceof databaseType) {
                    return db;
                }
            }
        }
        return command;
    }

    static async getDatabase() {
        return await this._cache(new Database(new DatabaseConnection()), Database);
    }
}

module.exports = DatabaseFactory;
