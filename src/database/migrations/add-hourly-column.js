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
        return queryInterface.addColumn("User", "has_hourly_reminder", {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("User", "has_hourly_reminder");
    }
};