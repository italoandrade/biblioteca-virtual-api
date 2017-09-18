const crypto = require('../../helpers/crypto');

module.exports = {
    login,
    relogin: login
};

async function login(data) {
    delete data.senhaCorreta;
    data.token = crypto.encrypt(data.token);

    return data;
}
