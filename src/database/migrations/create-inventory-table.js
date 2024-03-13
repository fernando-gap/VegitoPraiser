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
        return queryInterface.createTable("Inventory", {
            store_item: {
                type: Sequelize.STRING,
                allowNull: false
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
        return queryInterface.dropTable("Inventory");
    }
};