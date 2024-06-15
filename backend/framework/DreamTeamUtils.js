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
    const date = new Date();

    // Fonction pour obtenir un nombre aléatoire entre min et max inclus
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let result = '';

    for (let i = 0; i < password.length; i++) {
        let charCode = password.charCodeAt(i);
        let newCharCode = charCode + date.getHours() + date.getMinutes() + date.getSeconds() + password.length + getRandomNumber(1, 100);
        
        // Vérifier si newCharCode n'est pas NaN avant de l'ajouter
        if (!isNaN(newCharCode)) {
            result += String.fromCharCode(newCharCode);
        } else {
            // Si newCharCode est NaN, ajoutez un caractère aléatoire entre 97 ('a') et 122 ('z') à la place
            result += String.fromCharCode(
                getRandomNumber(
                    getRandomNumber(date.getSeconds(),date.getHours()),
                     getRandomNumber(date.getMilliseconds,date.getMinutes())
                )
            );
        }
    }

    result += getRandomNumber(
                getRandomNumber(
                    date.getMilliseconds() * date.getSeconds(),
                    getRandomNumber(date.getFullYear()*6, date.getUTCDate())
                ),
                getRandomNumber(
                    date.getMonth() * date.getMinutes(),
                    getRandomNumber(date.getTime()*6, date.getMilliseconds() * 2)
                )
            )

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