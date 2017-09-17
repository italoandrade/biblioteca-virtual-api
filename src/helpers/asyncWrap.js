const token = require('./token');

function asyncWrap(fn, config) {
    return async (req, res, next) => {
        if (config && config.public)
            return fn(req, res, next).catch(next);

        if (await token(req, res))
            fn(req, res, next).catch(next);
    };
}

global.asyncWrap = asyncWrap;
