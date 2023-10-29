const { properties } = require("./properties.json");

module.exports = {
    property: async (model) => {
        for (const property of properties) {
            try {
                await model.create({ name: property.name });
            } catch (e) {
                if (e.name === "SequelizeUniqueConstraintError") {
                    console.warn("Skipping creation of seed: ", e.fields);
                }
            }
        }
    },
    each: async (cb) => {
        for (const property of properties) {
            await cb(property);
        }

    }
};

