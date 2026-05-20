export const fqConfig = {
    tokenPath: import.meta.env.VITE_FQ_TOKEN_PATH || 'src/services/tokens.json',
    dev: {
        appName: 'test',
        serverUrl: 'http://localhost:4466',
    },
    prod: {
        appName: 'hms',
        serverUrl: 'https://v7.frontql.dev',
    },
};
