<<<<<<< HEAD
/*
Function to encrypt passwords with either a given salt or a randomly generated salt
AUTHOR: Thomas Vu
*/


const crypto = require('crypto');
const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();



//function to Password hashing/Encryption
//can either hash with a given salt or a randomly generated salt depending on arguments
//Returns an array [hashed password,salt] 
function stringHash(pass , salt) {

    var err = '';
    // if password is empty
    if(pass.length === 0){
        console.error('Error : Empty Password ');
        err = 'Error : Empty Password ';
        return err;
    }

    try {

        //checking to see if Salt is already given
        if (salt === undefined){
            //32 digit random hex number
            salt = crypto.randomBytes(16).toString('hex');
        }

        // hashing function to be used
        const digest = 'sha256';

        pass = pass.concat(salt);
        let hashPass = crypto.pbkdf2Sync(pass, salt, 100000, 64, digest).toString('hex'); // generates 64 byte hashed password (iterates 100000 times)

        var output = [hashPass,salt];
        return output;

    } catch (error){

        console.error(`Error Hashing Password : ${error}`);
        err = `Error Hashing Password : ${error}`;
        return err;

    } // end of try-catch
    

} //end of function


=======
/*
Function to encrypt passwords with either a given salt or a randomly generated salt
AUTHOR: Thomas Vu
*/


const crypto = require('crypto');
const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();



//function to Password hashing/Encryption
//can either hash with a given salt or a randomly generated salt depending on arguments
//Returns an array [hashed password,salt] 
function stringHash(pass , salt) {

    var err = '';
    // if password is empty
    if(pass.length === 0){
        console.error('Error : Empty Password ');
        err = 'Error : Empty Password ';
        return err;
    }

    try {

        //checking to see if Salt is already given
        if (salt === undefined){
            //32 digit random hex number
            salt = crypto.randomBytes(16).toString('hex');
        }

        // hashing function to be used
        const digest = 'sha256';

        pass = pass.concat(salt);
        let hashPass = crypto.pbkdf2Sync(pass, salt, 100000, 64, digest).toString('hex'); // generates 64 byte hashed password (iterates 100000 times)

        var output = [hashPass,salt];
        return output;

    } catch (error){

        console.error(`Error Hashing Password : ${error}`);
        err = `Error Hashing Password : ${error}`;
        return err;

    } // end of try-catch
    

} //end of function


>>>>>>> 4eb53f0bcb76ced8e2abca3397deb1d2f7e1729d
module.exports = stringHash;