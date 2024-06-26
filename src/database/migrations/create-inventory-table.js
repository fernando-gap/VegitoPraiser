module.exports = {
    /**
     * @typedef {import('sequelize').Sequelize} Sequelize
     * @typedef {import('sequelize').QueryInterface} QueryInterface
     */

    /**
     * @param {QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     * @returns
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("UserShopInventory", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            item_code: {
                type: Sequelize.STRING,
                references: {
                    model: "Shop",
                    key: "code"
                },
                onDelete: "cascade",
                onUpdate: "cascade"
            },
            user_id: {
                type: Sequelize.STRING,
                references: {
                    model: "User",
                    key: "id"
                },
                onDelete: "cascade",
                onUpdate: "cascade"
            }
        });
    },
    /**
     * @typedef {import('sequelize').Sequelize} Sequelize
     * @typedef {import('sequelize').QueryInterface} QueryInterface
     */

    /**
     * @param {QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     * @returns
     */
    down: (queryInterface) => {
        return queryInterface.dropTable("UserShopInventory");
    }
};