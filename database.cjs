const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const prod = dotenv.parse(fs.readFileSync(path.resolve("./db_prod.env")));
const dev = dotenv.parse(fs.readFileSync(path.resolve("./db_dev.env")));

module.exports = {
    development: {
        username: dev.MYSQL_USER,
        password: dev.MYSQL_PASSWORD,
        database: dev.MYSQL_DATABASE,
        host: dev.MYSQL_HOST,
        port: dev.MYSQL_PORT,
        dialect: "mysql",
        dialectOptions: {
            bigNumberStrings: true
        }
    },
    production: {
        username: prod.MYSQL_USER,
        password: prod.MYSQL_PASSWORD,
        database: prod.MYSQL_DATABASE,
        host: prod.MYSQL_HOST,
        port: prod.MYSQL_PORT,
        dialect: "mysql",
        dialectOptions: {
            bigNumberStrings: true,
        }
    }
};