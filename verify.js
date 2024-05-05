
/*
This function takes in two variables, a type string, indicating
what is to be tested, and an id to test, either a string or a number.
It returns a boolean, true if valid, false if not OR an invalid input
(an unlisted type, or an id string when a number is required,
    or an id number when a string is required)
Feel free to change this, but note it in the chat.
Password validation is not currently included
The cart, order, and support ids are expanded to 10 numbers instead 
of 5 (based on the feedback), the product id is 16 numbers
*/

//todo: R, 1-100 number,password
const sta = require('./idStandard.js');
console.log(verify("discountCode","2A3B4F"));
function verify(type,id){
if (typeof id == "string") {
    //check if the type is in the standard if yes, use the standard to verify (included id:cart,product,order,review,vehicle,support,appointment,member)
    if (sta[type] != undefined) {
        if (id[0]==sta[type].prefix & id.length == sta[type].length) {
            return true;
        }
        return false;
    //if the type is not in the standard, use the following:
    } else if (type =="search") {//input for the search bar
        if (id.length >= 5 & id.length <= 20) {
            return true;
        }
        return false;
    }  else if (type =="string") {//a string used for ordinary functions:
        //product name, member name, member address, vehicle make, 
        //vehicle model.
        if (id.length >= 2 & id.length <= 256) {
            return true;
        }
        return false;
    } else if (type =="discountCode") {//a 6-digit discount code in hexadecimal
        if (id.length == 6) {
            for (var i =0;i<6;i++) {
                if (!(!isNaN(id[i]) | id[i]=='A' | id[i]=='B' | id[i]=='C' | id[i]=='D' | id[i]=='E' | id[i]=='F' | id[i]=='a' | id[1]=='b' | id[i]=='c' | id[i]=='d' | id[i]=='e' | id[i]=='f' )) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }  else if (type =="email") {//an email string
        if (input.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        return true;
        }
        return false;
    }  else if (type =="date") {//a date in YYYYMMDDTHHMMSS format
        if (id.length == 15 & !isNaN(id.substring(0,7)) & id[8]=='T' & !isNaN(id.substring(9,15))){
            return true;
        }
        return false;
    } else if (type =="phone") {//a phone number in NNNNNNNNNN format
        if (id.length ==10 & !isNaN(id)) {
            return true;
        }
        return false;
    } else if (type=="specification"){
        if  (id != "Scheduled" & id !="Canceled" & id != "Finished") {
            return false;
        }
        return true;
    }else{
        return false;
    }

} else if (typeof id == "number") {
        console.log("int");
    if (type =="quantity") {//a quantity of itmes
    if (id >= 1 & Number.isInteger(id)) {
            return true;
        }
        return false;
    }
    else if (type =="stock") {//a stock (this currently only takes in strings)

        if (id >= 0 & id <= 999) {
            return true;
        }
        return false;
    }else if (type =="year") {//a reasonable year
        if (!isNaN(id)) {
            if (id >= 1900 & id <= 2100){
            return true;
            }
        }
        return false;
    }  else if (type =="discountPercentage") {//a discount percentage 1-100
        if (!isNaN(id) & id >=1 & id <= 100) {
            return true;
        }
        return false;
    }else{
        return false;
    }

} else {
    return false;
}
}

module.exports = verify;