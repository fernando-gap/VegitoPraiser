class DataAccessUser {
    constructor(db) {
        this.db = db;
    }

    async select(id) {
        return await this.db.model.User.findOne({ where:  { id: id }});
    }

    async update(id, property, value) {
        await this.db.model.User.update({ [property]: value }, {
            where: {
                id: id
            }
        });
    }

    async create(id) {
        try {
            await this.db.model.User.create({ id });
        } catch(e) {
            if (e.name === "SequelizeUniqueConstraintError") return;
            throw e;
        }
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

    async update(id, properties) {
        return await this.db.model.Schedule.update({
            ...properties,
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

    createManually() {
        this.temporaryManually = this.db.model.Schedule.build();
    }

    addManually(column, value) {
        this.temporaryManually[column] = value;
    }

    async saveManually() {
        await this.temporaryManually.save();
        this.temporaryManually = undefined;
    }
}


module.exports = {
    DataAccessUser,
    DataAccessProperty,
    DataAccessSchedule
};