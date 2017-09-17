module.exports = (app) => {
    app.route('/ping').get((req, res) => {
        return res.finish({
            httpCode: 200,
            content: new Date()
        });
    });
};
