module.exports = {
    apps : [{
        name   : "VegitoPraiser",
        script : "./src/main.js",
        min_uptime: 10 * 1000,
        listen_timeout: 10000,
        kill_timeout: 5 * 60 * 1000,
        max_restarts: 100,
        restart_delay: 4000,
        env: {
            NODE_ENV: "production"
        },
    },
    {
        name   : "VegitoPraiserDev",
        script : "./src/main.js",
        watch: true,
        ignore_watch: ["node_modules"],
        restart_delay: 5000,
        env: {
            NODE_ENV: "development",
        }
    }]
};
