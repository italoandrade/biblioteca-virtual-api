require('./config/config');
require('./src/infra/db');
require('./src/helpers/asyncWrap');

const express = require('express');
const app = express();
const consign = require('consign')({verbose: false});
const bodyParser = require('body-parser');

const middlewareNoc = require('./src/api/middleware/noc');
const middlewareErrors = require('./src/api/middleware/errors');
const middlewareCors = require('./src/api/middleware/cors');
const middlewareResponse = require('./src/api/middleware/response');

module.exports = startServer;

function startServer() {
    app.use(bodyParser.json({limit: '30mb'}));
    app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

    app.use(middlewareCors);
    app.use(middlewareResponse);
    app.use(middlewareNoc.begin);

    consign
        .include('./src/api/routes')
        .into(app);

    app.use(middlewareErrors.notFound);
    app.use(middlewareNoc.end);

    app.listen(global.config.api.port, () => {
        console.log(`Servidor rodando na porta ${global.config.api.port}`);
    });
}

