module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '^@core(.*)$': '<rootDir>/src/core$1',
        '^@components(.*)$': '<rootDir>/src/components$1',
        '^@redux(.*)$': '<rootDir>/src/redux$1'
    }
}
