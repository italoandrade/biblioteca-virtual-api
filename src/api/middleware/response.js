const messagePool = {
    400: 'Requisição inválida',
    401: 'Requisição não autorizada',
    403: 'Requisição proibida',
    404: 'Recurso não encontrado',
    409: 'Requisição conflitante',
    500: 'Erro interno'
};

module.exports = response;

function response(req, res, next) {
    res.finish = (result) => {
        finish(res, result, next);
    };

    next();
}

function finish(res, result, next) {
    result.httpCode = result.httpCode || 200;

    res.httpCode = result.httpCode;

    let message = messagePool[result.httpCode];

    if (result.error) {
        message = ((result.httpCode < 500) ? result.error.message : null) || message;

        res.errorCode = result.error.executionCode;
        res.description = (result.httpCode === 500) ? result.error.message : result.error;
    }

    res.status(result.httpCode);

    setTimeout(() => {
        if (result.httpCode === 200) {
            res.json(result.content);
        } else {
            res.json({
                executionCode: result.error && result.error.executionCode !== 0 ? result.error.executionCode : undefined,
                content: result.content,
                message: message,
                validationErrors: (result.httpCode === 400) ? result.error : undefined,
                internalError: (!global.config.isProduction && result.httpCode === 500) ? res.description : undefined
            });
        }

        next();
        // }, 2000);
    }, 0);
}
