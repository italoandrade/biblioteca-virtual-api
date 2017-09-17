const cluster = require('cluster');
const server = require('./server');

if (global.config.isProduction && cluster.isMaster) {
    for (let i = 0; i < global.config.cpuCount; i++) cluster.fork();

    cluster.on('exit', (worker) => {
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });
} else {
    server();
}
