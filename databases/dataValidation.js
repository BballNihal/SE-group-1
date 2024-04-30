

//Checks if requestData has valid orderId or productId

//
//Author : Thomas Vu

const http = require('http');
const url = require('url');

function dataValidation(res, requestData, requiredProperties) {

    //Check for required Properties
    for (let prop of requiredProperties) {
        if (!requestData.hasOwnProperty(prop)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Missing required property: ${prop}`);
            return false;
        }
    }


    //Check for empty Ids + checks format for properties
    for (let i = 0; i < requiredProperties.length; i++) {

        let property = requiredProperties[i];

        if (requestData[property].length === 0) {

            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Error : Missing ${property} `);
            return false;

        }

        //check for property formats
        switch (property) {

            case 'orderId':

                //Check for Order ID Format(O00000)
                if (requestData.orderId[0] !== 'O') {

                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end(`Error : Incorrect orderId Format Missing O `)
                    return false;

                } else if (requestData.orderId.length !== 6) {

                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end(`Error : Incorrect orderId Format Not 5 digits`)
                    return false;

                } else if (isNaN(requestData.orderId.substring(1))) {

                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end(`Error : Incorrect orderId Format not integer values in ID `)
                    return false;
                }


            break; // end of order ID

            case 'productId':
                //Check for productId format (P0000000000000000)
                if (requestData.productId[0] !== 'P') {

                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end(`Error : Incorrect productId Format Missing P `)
                    return false;

                } else if (requestData.productId.length !== 17) {

                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end(`Error : Incorrect productId Format Not 16 digits`)
                    return false;

                } else if (isNaN(requestData.productId.substring(1))) {

                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end(`Error : Incorrect productId Format not integer values in ID `)
                    return false;
                }



            break;// end of product ID


            case 'deliveryStatus':

                if (requestData.deliveryStatus === 'Ordered' || requestData.deliveryStatus === 'Sent' || requestData.deliveryStatus === 'Delivered') {


                }else{

                    res.writeHead(400, { 'Content-type': 'text/plain' });
                    res.end('Error : Improper delivery Status ');
                    return false;
                }

            break; //end of delieveryStatus

            case 'discountAmount':

                var parsedDiscount = requestData.discountAmount;
                //Checking if discount amount is a proper flat amount or percentage and non negative
                if (requestData.discountAmount.endsWith('%')) {

                    parsedDiscount = parseFloat(requestData.discountAmount.slice(0, -1));
                }

                //check if number
                if (isNaN(parsedDiscount)) {

                    res.writeHead(400, { 'Content-type': 'text/plain' });
                    res.end(`Error : Discount Amount ${parsedDiscount} is not a number `);
                    return false;

                }else if (parsedDiscount < 0){

                    res.writeHead(400, { 'Content-type': 'text/plain' });
                    res.end(`Error : Discount Amount ${parsedDiscount} is negative `);
                    return false;
                }

                

            break;//end of discount amount



            case 'discountCode':
                
                //Checking length of discount code
                if(requestData.discountCode.length !== 6){

                    res.writeHead(400, { 'Content-type': 'text/plain' });
                    res.end(`Error : Discount Code ${requestData.discountCode} is not a 6 digit code `);
                    return false;
                }


            break;//end of discount Code

        }//End of Switch Case 

    }// End of For loop


    return true;
}

module.exports = dataValidation;