let log = {
    dateLog: undefined,
    user: undefined,
    ipUser: undefined,
    ipReq: undefined,
    application: undefined,
    method: undefined,
    path: undefined,
    query: undefined,
    body: undefined,

    httpCode: undefined,
    errorCode: undefined,
    executionTime: undefined,
    description: undefined
};

exports.begin = function (req, res, next) {
    req.log = JSON.parse(JSON.stringify(log)); // clonando

    req.log.dateLog = new Date();
    req.log.user = req.token;
    req.log.ipUser = req.ip.replace('::ffff:', '');
    req.log.ipReq = req.headers.Client;
    req.log.application = global.config.appName;
    req.log.method = req.method;
    req.log.path = req.path;
    req.log.query = req.query;
    req.log.body = req.body;

    next();
};

exports.end = function (req, res, next) {
    req.log.executionTime = new Date().getMilliseconds() - req.log.dateLog.getMilliseconds();
    req.log.httpCode = res.httpCode;
    req.log.errorCode = res.errorCode || 0;
    req.log.description = res.description;

    if (!global.config.isProduction) console.log(req.log);

    delete req.log.body.senha;
    delete req.log.body.confirmarSenha;

    noc(req.log);

    next();
};

function noc(log) {
    // console.log(log);
}
