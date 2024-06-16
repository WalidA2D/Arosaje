const handleDBOperation = (operation) => {
    return new Promise((resolve, reject) => {
        operation((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const encryptMethod = (password) => {
    let result = '';
    let decalage = password.length + 4;
    const forbiddenChars = ['"', "'", '\\', '/', '<', '>', '&', '%', '@', '`', '?', " ", "%", "|"];

    for (let i = 0; i < password.length; i++) {
        let charCode = password.charCodeAt(i);

        let newCharCode = charCode + decalage; // Décaler avec code ASCII

        // Si newCharCode = NaN on le réajuste
        if (newCharCode < 32 || newCharCode > 126) {
            newCharCode = ((newCharCode - 32) % 95) + 32;
        }

        // Vérifier si newCharCode est autorisé
        let newChar = String.fromCharCode(newCharCode);
        while (forbiddenChars.includes(newChar)) {
            newCharCode++;
            if (newCharCode > 126) {
                newCharCode = 32;
            }
            newChar = String.fromCharCode(newCharCode);
        }
        result += newChar;
    }

    return result;
};
const validateUserInputCreation = (lastName, firstName, email, address, phone, cityName) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ'-\s]{1,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const addressRegex = /^.{1,50}$/; // On vérifie si ça fait bien 50
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    const cityRegex = /^[a-zA-ZÀ-ÿ'-\s]{1,50}$/;

    if (!nameRegex.test(lastName)) {
        return { valid: false, message: 'Invalid last name' };
    }

    if (!nameRegex.test(firstName)) {
        return { valid: false, message: 'Invalid first name' };
    }

    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email' };
    }

    if (!addressRegex.test(address)) {
        return { valid: false, message: 'Invalid address' };
    }

    if (!phoneRegex.test(phone)) {
        return { valid: false, message: 'Invalid phone number' };
    }

    if (!cityRegex.test(cityName)) {
        return { valid: false, message: 'Invalid city name' };
    }

    return { valid: true, message: 'Validation successful' };
};

module.exports = { 
    handleDBOperation, 
    encryptMethod, 
    validateUserInputCreation
};


// const { promisify } = require('util');

// const promisedDBOp = (db, method) => {
//     return promisify(db[method].bind(db));
// };

// module.exports = { promisedDBOp };