const validate = require('../../helpers/validate');

module.exports = {
    selecionarHistorico
};

async function selecionarHistorico(params) {
    const validation = {
        search: {
            string: true,
            maxLength: 200
        }
    };

    await validate(params, validation);
}