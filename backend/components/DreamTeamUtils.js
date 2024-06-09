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

    // numéro aléatoire entre min et max inclus
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let result = '';

    for (let i = 0; i < password.length; i++) {
        let charCode = password.charCodeAt(i);
        let newCharCode = charCode + date.getHours() + date.getMinutes() + date.getSeconds() + password.length + getRandomNumber(1, 100);
        result += String.fromCharCode(newCharCode);
    }

    result += result*2

    return result
}

module.exports = { handleDBOperation, encryptMethod };


// const { promisify } = require('util');

// const promisedDBOp = (db, method) => {
//     return promisify(db[method].bind(db));
// };

// module.exports = { promisedDBOp };