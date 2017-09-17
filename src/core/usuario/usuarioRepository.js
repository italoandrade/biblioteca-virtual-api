const db = global.db;

module.exports = {
    login,
    relogin,
    signup,
    // confirmEmail,
    // recoverPassword: login,
    // recoverPasswordConfirm,
    //
    // selectNotification,
    // recheckNotification,
    // notificationMarkAllRead,
    // notificationDismiss,
    // notificationRestore,
    // notificationMarkOpen,
    //
    // selectTvshow,
    // markEpisodeAsWatched
};

async function login(params) {
    return db.func('Biblioteca.UsuarioLogin', [
        null,
        params.email,
        params.senha
    ]);
}

async function relogin(params) {
    return db.func('Biblioteca.UsuarioLogin', [
        params.userId,
        null,
        null
    ]);
}

async function signup(params) {
    let error;

    let data = db.json('Biblioteca.UsuarioSignup', [
        params.nome,
        params.email,
        params.senha
    ]);

    switch (data.executionCode) {
        case 2:
            error = data;
            error.httpCode = 409;
            break;
    }

    if (error) {
        throw error;
    } else {
        return data;
    }
}

// async function confirmEmail(userId) {
//     return db.json('Boneare.UserConfirmEmail', [
//         userId
//     ]);
// }
//
// async function recoverPasswordConfirm(params) {
//     return db.json('Boneare.UserRecoverPasswordConfirm', [
//         params.userId,
//         params.password
//     ]);
// }
//
// async function selectNotification(params) {
//     return db.func('Boneare.SelectUserNotification', [
//         params.userId,
//         params.unless
//     ]);
// }
//
// async function recheckNotification(params) {
//     return db.func('Boneare.RecheckUserNotification', [
//         params.userId
//     ]);
// }
//
// async function notificationMarkAllRead(params) {
//     return db.json('Boneare.UserNotificationMarkAllRead', [
//         params.userId
//     ]);
// }
//
// async function notificationDismiss(params) {
//     return db.json('Boneare.UserNotificationDismiss', [
//         params.userId,
//         params.id
//     ]);
// }
//
// async function notificationRestore(params) {
//     return db.json('Boneare.UserNotificationRestore', [
//         params.userId,
//         params.id
//     ]);
// }
//
// async function notificationMarkOpen(params) {
//     return db.json('Boneare.UserNotificationMarkOpen', [
//         params.userId,
//         params.id
//     ]);
// }
//
// async function selectTvshow(params) {
//     return db.func('Boneare.SelectUserTvshow', [
//         params.userId,
//         params.type,
//         params.search,
//         params.orderBy,
//         params.genres,
//         params.showArchived,
//         params.unless
//     ]);
// }
//
// async function markEpisodeAsWatched(params) {
//     return db.json('Boneare.UserTvshowMarkEpisodeAsWatched', [
//         params.userId,
//         params.tvshowId,
//         params.id
//     ]);
// }
