module.exports = {
    apps : [{
        name   : "VegitoPraiser",
        script : "./build/main.js",
        listen_timeout: 5000,
        kill_timeout: 5,
        max_restarts: 10,
        restart_delay: 5000,
        env: {
            NODE_ENV: "production"
        },
    },
    {
        name   : "VegitoPraiserDev",
        script : "./src/main.js",
        watch: true,
        ignore_watch: ["node_modules"],
        max_restarts: 500,
        restart_delay: 5000,
        env: {
            NODE_ENV: "development",
        }
    }]
};
