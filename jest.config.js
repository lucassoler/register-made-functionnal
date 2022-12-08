module.exports = {
    globalSetup: "<rootDir>/configuration/tests/jest.setup.js",
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest'
    },
    modulePathIgnorePatterns: [
        "<rootDir>/node_modules",
        "<rootDit</dist"
    ],
};