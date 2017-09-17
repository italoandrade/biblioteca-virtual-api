const db = global.db;

module.exports = {
    select,
    selectById,
    insert,
    update,
    deletee
};

async function select(params) {
    return db.func('Boneare.SelectClient', [
        params.search,
        params.page,
        params.lines,
        params.orderName,
        params.orderCnpj,
        params.orderEmail,
        params.orderPhone
    ]);
}

async function selectById(params) {
    return db.func('Boneare.SelectClientById', [
        params.id
    ]);
}

async function insert(params) {
    return db.json('Boneare.InsertClient', [
        params.userId,
        params.typeId,
        params.name,
        params.contactName,
        params.razaoSocial,
        params.cnpj,
        params.inscricaoEstadual,
        params.address,
        params.recurringOrder,
        params.recurringDate,
        params.typeRecurringId,
        params.regionId,
        params.phones,
        params.emails
    ]);
}

async function update(params) {
    return db.json('Boneare.UpdateClient', [
        params.userId,
        params.id,
        params.typeId,
        params.name,
        params.contactName,
        params.razaoSocial,
        params.cnpj,
        params.inscricaoEstadual,
        params.address,
        params.recurringOrder,
        params.recurringDate,
        params.typeRecurringId,
        params.regionId,
        params.phones,
        params.emails
    ]);
}

async function deletee(params) {
    return db.json('Boneare.DeleteClient', [
        params.id
    ]);
}
