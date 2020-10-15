module.exports = {
    preset: "ts-jest",
    globalSetup: "./tests/setup/globalSetup.js",
    globalTeardown: "./tests/setup/globalTeardown.js",
    transform: {
        "\\.(ts|tsx)$": "ts-jest"
    },
    testEnvironment: "node"
};
