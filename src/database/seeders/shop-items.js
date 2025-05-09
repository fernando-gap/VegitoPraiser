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
        return queryInterface.bulkInsert("Shop", [
            {
                name: "Potara Earrings",
                emoji: "<:potaraearrings:1193378255407951982>",
                description: "Skips cooldown; fuse with a friend",
                code: "ptr",
                price: 30
            },
            {
                name: "Senzu Beans",
                emoji: "<:senzubeans:1196163480269619230>",
                description: "decrease the time of cooldown by a small percentage once.",
                code: "szb",
                price: 10
            },
            {
                name: "Dragon Ball",
                emoji: "<:dragonball:1193963653788090479>",
                description: "Earn double Potara coins and a mysterious item.",
                code: "dbz",
                price: 50
            },
            {
                name: "Vegito's Gi",
                emoji: "<:vegitogi:1195760497249755207>",
                description: "2x Potara coins per praise forever.",
                code: "vgi",
                price: 500
            },
            {
                name: "Flying Nimbus",
                emoji: "<:flyingnimbus:1194292069108297778>",
                description: "15 minutes less cooldown forever.",
                code: "fln",
                price: 300
            }
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
        return queryInterface.bulkDelete("Shop", null, {});
    }
};