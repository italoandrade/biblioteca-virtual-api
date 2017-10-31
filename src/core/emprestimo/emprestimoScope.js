const validate = require('../../helpers/validate');

module.exports = {
    selecionar
};

async function selecionar(params) {
    const validation = {
        search: {
            string: true,
            maxLength: 200
        }
    };

    await validate(params, validation);
}