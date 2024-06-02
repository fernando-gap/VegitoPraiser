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
    up: (queryInterface) => {
        return queryInterface.bulkInsert("Reminder", [
            {
                id: 0,
                reminder: "disabled"
            },
            {
                id: 1,
                reminder: "hourly_enabled"
            },
            {
                id: 2,
                reminder: "daily_enabled"
            },
        ]);
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
        return queryInterface.bulkDelete("Reminder", null, {});
    }
};