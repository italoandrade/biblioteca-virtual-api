const crypto = require('./crypto');

module.exports = token;

async function token(req, res) {
    if (!req.headers.authentication) {
        res.finish({
            httpCode: 401,
            error: {
                executionCode: 1,
                message: 'Token não informado'
            }
        });
        return false;
    }

    let token = crypto.decrypt(req.headers.authentication);

    if (!token || token.error) {
        res.finish({
            httpCode: 403,
            error: {
                executionCode: 1,
                message: 'Token inválido'
            }
        });
        return false;
    }

    req.token = token;

    return true;
}
