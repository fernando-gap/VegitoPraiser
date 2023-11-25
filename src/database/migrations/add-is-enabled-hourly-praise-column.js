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
        return queryInterface.addColumn("Schedule", "has_hourly_reminder", {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Schedule", "has_hourly_reminder");
    }
};