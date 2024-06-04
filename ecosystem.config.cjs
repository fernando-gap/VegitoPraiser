module.exports = {
    apps : [{
        name   : "VegitoPraiser",
        script : "./build/main.js",
        max_restarts: 10,
        restart_delay: 5000,
        env: {
            NODE_ENV: "production"
        },
    },
    {
        name   : "VegitoPraiserDev",
        script : "./build/main.js",
        watch: true,
        ignore_watch: ["node_modules"],
        max_restarts: 500,
        env: {
            NODE_ENV: "development",
        }
    }]
};
