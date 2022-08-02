module.exports = {
    extends: "@alchemisten/eslint-config",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
            "./tsconfig.eslint.json",
            "./tsconfig.json"
        ]
    },
    root: true
}
