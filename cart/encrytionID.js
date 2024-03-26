//generate 6 digit id by encrytion of input and current time

const crypto = require('crypto');
function encrytionID(input) {
    return crypto.createHash('md5').update(input+Date.now()).digest('hex').substring(0,6);
}
module.exports = encrytionID;