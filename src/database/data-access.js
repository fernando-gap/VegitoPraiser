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

class DataAccessProperty {
    constructor(db) {
        this.db = db;
    }

    async selectAll(limit, order=["praise_count", "DESC"]) {
        return await this.db.model.Property.findAll({
            order: [order],
            limit: limit
        });
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

class DataAccessSchedule {
    constructor(db) {
        this.db = db;
    }

    async selectAll() {
        return await this.db.model.Schedule.findAll();
    }

    async select(id) {
        return await this.db.model.Schedule.findOne({
            where: {
                user_id: id
            }
        });
    }

    async create(id, channelId) {
        await this.db.model.Schedule.create({ user_id: id, channel_id: channelId});
    }

    async update(id, channelId) {
        const date = new Date();

        return await this.db.model.Schedule.update({
            channelId: channelId,
            last_praise: date
        }, {
            where: {
                user_id: id
            }
        });
    }

    async delete(id) {
        return await this.db.model.Schedule.destroy({
            where: {
                user_id: id
            }
        });
    }
}


module.exports = {
    DataAccessUser,
    DataAccessProperty,
    DataAccessSchedule
};