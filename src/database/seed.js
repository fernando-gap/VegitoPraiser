const { properties } = require("./properties.json");

module.exports = async (model) => {
    for (const property of properties) {
        try {
            await model.create(property);
        } catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
                console.warn("Skipping creation of seed: ", e.fields);
            }
        }
    }
};