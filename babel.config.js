module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module-resolver",
                {
                    root: ["./"],
                    alias: {
                        "@": "./src",
                    },
                },
            ],
        ],
        env: {
            production: {
                plugins: ["transform-remove-console"],
            },
        },
    };
};
