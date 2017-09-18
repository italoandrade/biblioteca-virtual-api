const crypto = require('./crypto');

module.exports = token;

async function token(req, res, config) {
    if (!req.headers.authentication) {
        if (config && !config.public) {
            res.finish({
                httpCode: 401,
                error: {
                    executionCode: 1,
                    message: 'Token não informado'
                }
            });
            return false;
        } else {
            return true;
        }
    }

    let token = crypto.decrypt(req.headers.authentication);

    if (!token || token.error) {
        res.finish({
            httpCode: 403,
            error: {
                executionCode: 2,
                message: 'Token inválido'
            }
        });
        return false;
    }

    if (config && config.internal && token.idTipoUsuario !== 1) {
        res.finish({
            httpCode: 401,
            error: {
                executionCode: 3,
                message: 'Você não tem permissão para acessar esta funcionalidade'
            }
        });
        return false;
    }

    req.token = token;

    return true;
}
