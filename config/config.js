const config = {
    appName: 'BibliotecaVirtual',
    isProduction: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
    cpuCount: process.env.CPU_COUNT || require('os').cpus().length,
    sqlConfig: {
        user: process.env.PG_USER || "dougras",
        database: process.env.PG_DB || "biblioteca_virtual",
        password: process.env.PG_PASSWORD || "teste123",
        host: process.env.PG_HOST || "localhost",
        port: process.env.PG_PORT || 5432,
        max: 10,
        idleTimeoutMillis: 30000
    },
    api: {
        port: process.env.API_PORT || 6969
    },
    secret: {
        key: process.env.SECRET_KEY || 'bivi'
    },
    aws: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        s3bucket: 'https://s3.amazonaws.com/biblioteca-virtual/'
    }
};

global.config = config;
