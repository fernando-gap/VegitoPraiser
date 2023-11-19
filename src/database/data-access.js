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

    async create(id) {
        try {
            await this.db.model.User.create({ id });
        } catch(e) {
            if (e.name === "SequelizeUniqueConstraintError") return;
            throw e;
        }
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

class DataAccessUserProperty {
    constructor(db) {
        this.db = db;
    }

    async select(property) {
        const data = await this.db.model.UserProperty.findAll({
            where: {
                [Op.eq]: {
                    propertyId: property
                }
            }
        });

        if (data === null) {
            throw new Error("Database Error: Property Missing");
        }
        return JSON.parse(data.value);
    }

    async create(id, property, value) {
        await this.db.model.UserProperty.create({
            userId: id,
            propertyId: property,
            value: JSON.stringify(value)
        });
    }
}

class DataAccessProperty {
    constructor(db) {
        this.db = db;
    }

    async select(id, ...properties) {
        const data = await this.db.model.Property.findOne({
            attributes: properties,
            where: {
                user_id: id
            }
        });

        /* User Property doesn't exist */
        if (data === null || data.length === 0) {
            this.create(id);
            this.select(id, ...properties);
        }

        return data;
    }

    async create(id) {
        await this.db.model.Property.create({ user_id: id });
    }

    async updatePraiserCount(id) {
        const data = await this.select(id, "praise_count", "id");
        data.increment(["praise_count"]);
    }
}

module.exports = {
    DataAccessUser,
    DataAccessUserProperty,
    DataAccessProperty
};