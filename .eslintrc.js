module.exports = {
    extends: ['airbnb-typescript/base'],
    "rules": {
        "max-len": ["warn", { "code": 140 }],
        "quotes": [2, "single", { "avoidEscape": true }],
        "@typescript-eslint/indent": ["error", 4],

    }
};
