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
        return queryInterface.addColumn("User", "reminderId", {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            references: {
                model: 'Reminder',
                key: "id"
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("User", "reminderId");
    }
};