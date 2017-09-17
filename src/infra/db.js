const pg = require('pg-promise')()(global.config.sqlConfig);

global.db = {
    json: async function (query, params) {
        let result = await pg.proc(query, params);

        return result ? result[Object.keys(result)[0]] : null;
    },
    query: pg.query,
    proc: pg.proc,
    func: pg.func
};
