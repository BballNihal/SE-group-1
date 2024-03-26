//receive integer n specify the number of digits of the id
//generate n digit id by encryption of all input arguments and current time
// call example: encrytionID(8, "hello", "world", "1234", "5678")

const crypto = require('crypto');

function encryptionID(n, ...args) {
    var id = '';
    for (i in args) {
        id += args[i];
    }
    id += Date.now();
    return crypto.createHash('sha256').update(id).digest('hex').substring(0,n);
}

module.exports = encryptionID;