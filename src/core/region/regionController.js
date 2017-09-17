const repository = require('./regionRepository');

module.exports = {
    select
};

async function select(req, res) {
    try {
        let data = await repository.select();

        return res.finish({
            httpCode: 200,
            content: data
        });
    } catch (error) {
        return res.finish({
            httpCode: 500,
            error
        });
    }
}
