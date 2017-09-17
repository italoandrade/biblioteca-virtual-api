const validate = require('../../helpers/validate');

module.exports = {
    select,
    selectById,
    insert,
    update,
    deletee
};

async function select(params) {
    const validation = {
        search: {
            string: true,
            maxLength: 200
        }
    };

    await validate(params, validation);
}

async function selectById(params) {
    const validation = {
        id: {
            required: true,
            string: true,
            maxLength: 200
        }
    };

    await validate(params, validation);
}

async function insert(params) {
    const validation = {
        typeId: {
            number: 'smallint'
        },
        name: {
            required: true,
            string: true,
            maxLength: 255
        },
        contactName: {
            string: true,
            maxLength: 100
        },
        razaoSocial: {
            string: true,
            maxLength: 255
        },
        cnpj: {
            string: true,
            maxLength: 14
        },
        inscricaoEstadual: {
            string: true,
            maxLength: 20
        },
        address: {
            string: true,
            maxLength: 255
        },
        recurringOrder: {
            boolean: true
        },
        recurringDate: {
            string: true,
            maxLength: 20
        },
        typeRecurringId: {
            number: 'smallint'
        },
        regionId: {
            number: 'smallint'
        },
        phones: {
            validation: {
                id: {
                    string: true,
                    maxLength: 200
                },
                clientId: {
                    string: true,
                    maxLength: 200
                },
                phone: {
                    required: true,
                    string: true,
                    maxLength: 11
                },
                description: {
                    string: true,
                    maxLength: 255
                }
            }
        },
        emails: {
            validation: {
                id: {
                    string: true,
                    maxLength: 200
                },
                clientId: {
                    string: true,
                    maxLength: 200
                },
                email: {
                    required: true,
                    string: true,
                    maxLenght: 255
                },
                description: {
                    string: true,
                    maxLength: 255
                }
            }
        }
    };

    await validate(params, validation);
}

async function update(params) {
    const validation = {
        typeId: {
            number: 'smallint'
        },
        id: {
            required: true,
            string: true,
            maxLength: 200
        },
        name: {
            required: true,
            string: true,
            maxLength: 255
        },
        contactName: {
            string: true,
            maxLength: 100
        },
        razaoSocial: {
            string: true,
            maxLength: 255
        },
        cnpj: {
            string: true,
            maxLength: 14
        },
        inscricaoEstadual: {
            string: true,
            maxLength: 20
        },
        address: {
            string: true,
            maxLength: 255
        },
        recurringOrder: {
            boolean: true
        },
        recurringDate: {
            string: true,
            maxLength: 20
        },
        typeRecurringId: {
            number: 'smallint'
        },
        regionId: {
            number: 'smallint'
        },
        phones: {
            validation: {
                id: {
                    string: true,
                    maxLength: 200
                },
                clientId: {
                    string: true,
                    maxLength: 200
                },
                phone: {
                    required: true,
                    string: true,
                    maxLength: 11
                },
                description: {
                    string: true,
                    maxLength: 255
                }
            }
        },
        emails: {
            validation: {
                id: {
                    string: true,
                    maxLength: 200
                },
                clientId: {
                    string: true,
                    maxLength: 200
                },
                email: {
                    required: true,
                    string: true,
                    maxLenght: 255
                },
                description: {
                    string: true,
                    maxLength: 255
                }
            }
        }
    };

    await validate(params, validation);
}

async function deletee(params) {
    const validation = {
        id: {
            required: true,
            string: true,
            maxLength: 200
        }
    };

    await validate(params, validation);
}
