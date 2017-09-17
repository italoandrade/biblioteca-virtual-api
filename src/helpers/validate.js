module.exports = validate;

function doValidate(params, validation) {
    let errorList = [];
    const paramsNames = Object.keys(validation);

    paramsNames.forEach((paramName) => {
        const metalDetector = validation[paramName];
        const suitcase = params[paramName];

        if (metalDetector.required) {
            if (typeof suitcase === "undefined") return errorList.push(`"${paramName}" é obrigatório`);
        }

        if (suitcase && metalDetector.number) {
            if (isNaN(suitcase)) return errorList.push(`"${paramName}" deve ser um número`);

            if (metalDetector.number === 'integer' && suitcase > 2147483647 && suitcase < -2147483648)
                return errorList.push(`"${paramName}" deve ser um número (integer)`);
            else if (metalDetector.number === 'smallint' && suitcase > 32768 && suitcase < -32768)
                return errorList.push(`"${paramName}" deve ser um número (smallint)`);
        }

        if (suitcase && metalDetector.string) {
            if (!(typeof suitcase === 'string' || suitcase instanceof String))
                return errorList.push(`"${paramName}" deve ser um texto`);
        }

        if (suitcase && metalDetector.boolean) {
            if (!(typeof suitcase === 'boolean'))
                return errorList.push(`"${paramName}" deve ser um boolean`);
        }

        if (suitcase && metalDetector.date) {
            if (!((new Date(suitcase) !== "Invalid Date") && !isNaN(new Date(suitcase))))
                return errorList.push(`"${paramName}" deve ser uma data`);
        }

        if (suitcase && metalDetector.validation) {
            const isObject = suitcase !== null && typeof suitcase === 'object';
            const isArray = suitcase && suitcase.constructor === Array;


            if (isArray) {
                suitcase.forEach((suitcaseItem, i) => {
                    const children = doValidate(suitcaseItem, metalDetector.validation);
                    children.forEach((error) => {
                        errorList.push(`${error} no ${i+1}° item de "${paramName}"`)
                    });
                });
            } else if (isObject) {
                const children = doValidate(suitcase, metalDetector.validation);
                children.forEach((error) => {
                    errorList.push(`${error} em "${paramName}"`)
                });
            }
        }

        if (suitcase && metalDetector.array) {
            let suitcaseParsed;
            try {
                suitcaseParsed = JSON.parse(suitcase);
            } catch (e) {
                suitcaseParsed = suitcase;
            }
            suitcaseParsed.forEach((suitcaseItem, i) => {
                let array = {};
                let arrayValidate = {};
                arrayValidate[paramName] = metalDetector.array;
                array[paramName] = suitcaseItem;
                const children = doValidate(array, arrayValidate);
                children.forEach((error) => {
                    errorList.push(`${error} no ${i+1}° item`);
                });
            });
        }
    });

    return errorList;
}

async function validate(params, validation) {
    const errorList = doValidate(params, validation);

    if (errorList.length) {
        throw errorList;
    }

    return true;
}
