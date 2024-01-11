import { DatabaseConnectionProduction, DatabaseConnectionDevelopment } from "./database-connection.js";

export class DatabaseConnectionFactory {
    static connections = [];
    /* TODO: error handling */

    static async getConnection(NODE_ENV = process.env.NODE_ENV) {
        let connection;
        if (NODE_ENV === "production") {
            connection = await DatabaseConnectionFactory.getProductionConnection();
        } else {
            connection = await DatabaseConnectionFactory.getDevelopmentConnection();
        }
        return connection;
    }

    static async getProductionConnection() {
        return await this._cacheConnection(() => {
            return new DatabaseConnectionProduction();
        }, DatabaseConnectionProduction);
    }

    static async getDevelopmentConnection() {
        return await this._cacheConnection(() => {
            return new DatabaseConnectionDevelopment();
        }, DatabaseConnectionDevelopment);
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