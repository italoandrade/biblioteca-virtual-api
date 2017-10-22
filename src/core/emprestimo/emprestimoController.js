const repository = require('./emprestimoRepository');
const scope = require('./emprestimoScope');

module.exports = {
    selecionarHistorico
};

async function selecionarHistorico(req, res) {
    const params = {
        search: req.query.search,
        page: req.query.page,
        lines: req.query.lines || 10,
        order: req.query.order
    };

    if (params.order) {
        const orders = params.order.split(',');
        orders.forEach(order => {
            const orderOrientation = order.split('-');
            params['order' + capitalizeFirstLetter(orderOrientation[0])] = orderOrientation[1];
        });
    }

    try {
        await scope.selecionarHistorico(params);
    } catch (err) {
        return res.finish({
            httpCode: 400,
            error: err
        });
    }

    try {
        let data = await repository.selecionarHistorico(params);

        let lineCount = 0;

        data.forEach(item => {
            lineCount = item.lineCount;
            delete item.lineCount;
        });

        return res.finish({
            httpCode: 200,
            content: {
                data,
                lineCount
            }
        });
    } catch (error) {
        return res.finish({
            httpCode: 500,
            error
        });
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
