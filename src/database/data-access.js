const { Op } = require("sequelize");

class DataAccessUser {
    constructor(db) {
        this.db = db;
    }

    async select(id, property) {
        const data = await this.db.model.UserProperty.findOne({
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
        console.log(this.db);
        await this.db.connection.driver.transaction(async (t) => {
            await this.db.model.User.create({
                id: id
            }, { transaction: t});

            await this.db.model.UserProperty.create({
                userId: id,
                propertyId: property,
                value: JSON.stringify(value)
            }, {transaction: t});

        });
    }

    async update(id, property, value) {
        await this.db.model.UserProperty.update({ value: JSON.stringify(value)}, {
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
    DataAccessUser
};