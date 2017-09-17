const db = global.db;

module.exports = {
    select
};

async function select() {
    return db.func('Boneare.SelectTypeClient');
}
