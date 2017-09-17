const repository = require('./clientRepository');
const scope = require('./clientScope');

const colorize = require('../../helpers/colorize');

module.exports = {
    select,
    selectById,
    insert,
    update,
    deletee
};

async function select(req, res) {
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
        await scope.select(params);
    } catch (err) {
        return res.finish({
            httpCode: 400,
            error: err
        });
    }

    try {
        let data = await repository.select(params);

        let lineCount = 0;

        data.forEach(item => {
            item.color = colorize(item.color);
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

async function selectById(req, res) {
    const params = {
        id: req.params.id
    };

    try {
        await scope.selectById(params);
    } catch (err) {
        return res.finish({
            httpCode: 400,
            error: err
        });
    }

    try {
        let data = await repository.selectById(params);

        if (!data.length) {
            return res.finish({
                httpCode: 404,
                error: {
                    executionCode: 1,
                    message: 'Cliente não encontrado'
                }
            });
        }

        data = data[0];

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

async function insert(req, res) {
    const params = {
        userId: req.token.id,
        typeId: req.body.typeId,
        name: req.body.name,
        contactName: req.body.contactName,
        razaoSocial: req.body.razaoSocial,
        cnpj: req.body.cnpj,
        inscricaoEstadual: req.body.inscricaoEstadual,
        address: req.body.address,
        recurringOrder: req.body.recurringOrder,
        recurringDate: req.body.recurringDate,
        typeRecurringId: req.body.typeRecurringId,
        regionId: req.body.regionId,
        phones: req.body.phones ? JSON.stringify(req.body.phones) : null,
        emails: req.body.emails ? JSON.stringify(req.body.emails) : null
    };

    try {
        await scope.insert(params);
    } catch (err) {
        return res.finish({
            httpCode: 400,
            error: err
        });
    }

    try {
        let data = await repository.insert(params);

        let httpCode = 200;
        let error;
        let content;

        switch (data.executionCode) {
            case 1:
                httpCode = 409;
                error = data;
                break;
            default:
                content = data.content;
        }

        return res.finish({
            httpCode: httpCode,
            error,
            content
        });
    } catch (error) {
        return res.finish({
            httpCode: 500,
            error
        });
    }
}

async function update(req, res) {
    const params = {
        userId: req.token.id,
        id: req.params.id,
        typeId: req.body.typeId,
        name: req.body.name,
        contactName: req.body.contactName,
        razaoSocial: req.body.razaoSocial,
        cnpj: req.body.cnpj,
        inscricaoEstadual: req.body.inscricaoEstadual,
        address: req.body.address,
        recurringOrder: req.body.recurringOrder,
        recurringDate: req.body.recurringDate,
        typeRecurringId: req.body.typeRecurringId,
        regionId: req.body.regionId,
        phones: req.body.phones ? JSON.stringify(req.body.phones) : null,
        emails: req.body.emails ? JSON.stringify(req.body.emails) : null
    };

    try {
        await scope.update(params);
    } catch (err) {
        return res.finish({
            httpCode: 400,
            error: err
        });
    }

    try {
        let data = await repository.update(params);

        let httpCode = 200;
        let error;
        let content;

        switch (data.executionCode) {
            case 1:
                httpCode = 404;
                error = data;
                break;
            case 2:
                httpCode = 409;
                error = data;
                break;
            default:
                content = {
                    message: 'Cliente alterado com sucesso'
                };
        }

        return res.finish({
            httpCode: httpCode,
            error,
            content
        });
    } catch (error) {
        return res.finish({
            httpCode: 500,
            error
        });
    }
}

async function deletee(req, res) {
    const params = {
        id: req.params.id
    };

    try {
        await scope.deletee(params);
    } catch (err) {
        return res.finish({
            httpCode: 400,
            error: err
        });
    }

    try {
        let data = await repository.deletee(params);

        let httpCode = 200;
        let error;
        let content;

        switch (data.executionCode) {
            case 1:
                httpCode = 404;
                error = data;
                break;
            default:
                content = {
                    message: 'Cliente excluído com sucesso'
                };
        }

        return res.finish({
            httpCode: httpCode,
            error,
            content
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
