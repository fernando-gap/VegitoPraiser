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

        return this.model.findOne(query);
    }

    async selectAll(limit = 50, offset = 0, order = []) {
        const query = {limit, offset};

        if (order.length > 0) {
            query.order = [order];
        }

        return this.model.findAll(query);
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

    async increment(where, ...columns) {
        let data = await this.selectOne(where);
        await data.increment(columns);
    }
}

export class DataAccessUser extends DataAccess {}
