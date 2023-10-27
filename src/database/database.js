const buildModel = require("./models.js");
const { Op } = require("sequelize");

class Database {
    constructor(db) {
        this.db = db;
    }
    close() {
        this.db.connection.close();
    }
}

class DatabaseUser {
    constructor(db) {
        this.db = db;
    }

    async select(id, property) {
        const model = await buildModel(this.db);
        const data = await model.UserProperty.findOne({
            where: {
                [Op.and]: [
                    { userId: id },
                    {propertyId: property }
                ]
            }
        });

        if (data === null) {
            throw new Error("User or Property Must Exist");
        }
        return JSON.parse(data.value);
    }

    async create(id, property, value) {
        const model = await buildModel(this.db);
        await this.db.connection.transaction(async (t) => {
            await model.User.create({
                id: id
            }, { transaction: t});

            await model.UserProperty.create({
                userId: id,
                propertyId: property,
                value: JSON.stringify(value)
            }, {transaction: t});

        });
    }

    async update(id, property, value) {
        const model = await buildModel(this.db);
        await model.UserProperty.update({ value: JSON.stringify(value)}, {
            where: {
                [Op.and]: [
                    { userId: id },
                    { propertyId: property }
                ]
            }
        });
    }
}

module.exports = {
    Database,
    DatabaseUser
};