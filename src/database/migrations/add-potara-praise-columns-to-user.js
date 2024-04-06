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
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn("User", "potara_coins", {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                }, { transaction: t }),
                queryInterface.addColumn("User", "praise_count", {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                }, { transaction: t }),
            ]);
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
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn("User", "potara_coins", { transaction: t }),
                queryInterface.removeColumn("User", "praise_count", { transaction: t }),
            ]);
        });
    }
};