exports.notFound = function (req, res, next) {
    if (!res.finished)
        res.finish({
            httpCode: 404
        });

    next();
};
