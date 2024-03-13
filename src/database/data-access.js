class DataAccess {

    constructor(db, model) {
        this.db = db;
        this.model = this.db.models[model];
    }

    async selectOne(where, attributes = []) {
        const query = { where };

        if (attributes.length > 0) {
            query.attributes = attributes;
        }

        return await this.model.findOne(query);
    }

    async selectAll(limit = 50, offset = 0, order = []) {
        const query = {limit, offset};

        if (order.length > 0) {
            query.order = [order];
        }

        return await this.model.findAll(query);
    }

    async create(data) {
        return await this.model.create(data);
    }
    async delete(where) {
        return await this.model.destroy({
            where: where
        });
    }

    async update(newData, where) {
        await this.model.update(newData, {
            where: where
        });
    }
}

export class DataAccessUser extends DataAccess { }
export class DataAccessProperty extends DataAccess {
    async updatePraiserCount(id) {
        let data = await this.selectOne({ user_id: id });

        if (data === null) {
            await this.create({ user_id: id });
            data = await this.selectOne({ user_id: id });
        }

        data.increment(["praise_count"]);
    }
}
