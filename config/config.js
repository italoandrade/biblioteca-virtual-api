const config = {
    appName: 'BibliotecaVirtual',
    isProduction: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
    cpuCount: process.env.CPU_COUNT || require('os').cpus().length,
    sqlConfig: {
        user: process.env.PG_USER || "dougras",
        database: process.env.PG_DB || "biblioteca_virtual",
        password: process.env.PG_PASSWORD || "teste123",
        host: process.env.PG_HOST || "52.87.115.99",
        port: process.env.PG_PORT || 5432,
        max: 10,
        idleTimeoutMillis: 30000
    },
    api: {
        port: process.env.API_PORT || 6969
    },
    secret: {
        key: process.env.SECRET_KEY || 'bivi'
    }
};

global.config = config;
