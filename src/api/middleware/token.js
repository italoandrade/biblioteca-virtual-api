const crypto = require('../../helpers/crypto');

const tokenWhitelist = /(\/ping)$/;

module.exports = (req, res, next) => {
    if (req.path.match(tokenWhitelist))
        return next();

    if (!req.headers.authentication)
        return res.finish({
            httpCode: 401
        });

    let token = crypto.decrypt(req.headers.authentication);

    if (!token || token.error)
        return res.finish({
            httpCode: 403,
            error: {
                executionCode: 1,
                message: 'Token inválido'
            }
        });

    req.token = token;

    next();
};
