module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/test"],
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  testRegex: "((src/.*/(__test__|__tests__)/.*|test/.*)\\.(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["<rootDir>/src/core/__test__/session-cipher.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "<rootDir>/src/core/__test-utils__/custom-jest-environment.js"
}
