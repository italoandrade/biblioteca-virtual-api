const validate = require('../../helpers/validate');

module.exports = {
    login,
    signup,
    // recoverPassword,
    // recoverPasswordConfirm,
    //
    // selectTvshow,
    // markEpisodeAsWatched
};

async function login(params) {
    const validation = {
        email: {
            required: true,
            string: true,
            maxLength: 255
        },
        senha: {
            required: true,
            string: true,
            maxLength: 40
        }
    };

    try {
        await validate(params, validation);
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}

async function signup(params) {
    const validation = {
        nome: {
            required: true,
            string: true,
            maxLength: 100
        },
        email: {
            required: true,
            string: true,
            maxLength: 255
        },
        senha: {
            required: true,
            string: true,
            maxLength: 40
        },
        confirmarSenha: {
            required: true,
            string: true,
            maxLength: 40
        }
    };

    try {
        await validate(params, validation);

        if (params.senha !== params.confirmarSenha) {
            throw ['Confirmação de senha não confere']
        }
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}

// async function recoverPassword(params) {
//     const validation = {
//         email: {
//             required: true,
//             string: true,
//             maxLength: 255
//         }
//     };
//
//     await validate(params, validation);
// }
//
// async function recoverPasswordConfirm(params) {
//     const validation = {
//         password: {
//             required: true,
//             string: true,
//             maxLength: 60
//         },
//         confirmPassword: {
//             required: true,
//             string: true,
//             maxLength: 60
//         }
//     };
//
//     await validate(params, validation);
// }
//
// async function selectTvshow(params) {
//     const validation = {
//         type: {
//             required: true,
//             string: true
//         },
//         search: {
//             string: true,
//             maxLength: 200
//         },
//         orderBy: {
//             string: true
//         },
//         genres: {
//             array: {
//                 string: true
//             }
//         },
//         showArchived: {
//             boolean: true
//         },
//         unless: {
//             array: {
//                 string: true
//             }
//         }
//     };
//
//     await validate(params, validation);
// }
//
// async function markEpisodeAsWatched(params) {
//     const validation = {
//         tvshowId: {
//             required: true,
//             string: true
//         },
//         id: {
//             required: true,
//             string: true
//         }
//     };
//
//     await validate(params, validation);
// }
