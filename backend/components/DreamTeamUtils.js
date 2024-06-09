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

module.exports = { handleDBOperation };


// const { promisify } = require('util');

// const promisedDBOp = (db, method) => {
//     return promisify(db[method].bind(db));
// };

// module.exports = { promisedDBOp };