module.exports = {
    extends: ["airbnb-typescript/base", "prettier"],
    reportUnusedDisableDirectives: true,
    rules: {
        "max-len": ["warn", { code: 140 }],
        quotes: [2, "single", { avoidEscape: true }],
        "@typescript-eslint/indent": ["error", 4],
        "@typescript-eslint/no-unused-vars": [
            "warn",
            { argsIgnorePattern: "^_", ignoreRestSiblings: true },
        ],
    },
};
