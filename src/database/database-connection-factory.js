const { DatabaseConnection, DatabaseConnectionDev } = require("./database-connection");

class DatababaseConnectionFactory {
    static connections = [];
    /* TODO: error handling */
    static async getConnection() {
        return await this._cacheConnection(() => {
            return new DatabaseConnection();
        }, DatabaseConnection);
    }

    static async getDevelopmentConnection() {
        return await this._cacheConnection(() => {
            return new DatabaseConnectionDev();
        }, DatabaseConnectionDev);
    }

    static async _cacheConnection(connectionCallback, connectionClass) {
        /* TODO: hashing cache */
        for (const conn of this.connections) {
            if (conn instanceof connectionClass) {
                if (await conn.isOnline()) {
                    return conn;
                } else { 
                    /* connection is offline or connection is closed */
                    const connectionNew = connectionCallback();
                    this.connections.push(connectionNew);
                    return connectionNew;
                }
            }
        }

        /* there are no current active connection */
        const connectionNew = connectionCallback();
        this.connections.push(connectionNew);
        return connectionNew;
    }
}

module.exports = DatababaseConnectionFactory;