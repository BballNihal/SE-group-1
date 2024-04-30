/*
    The purpose of this script is to generate the data for the product database.
    This is done by scraping product info off of the following websites:
        https://bulletproofautomotive.com/
        https://www.discounttiredirect.com/
    Output of this script is to a text file (products.txt)
    This script does not do any input verification. That will be done when moving the data into the product database

    AUTHOR: NIHAL ABDUL MUNEER
*/

const fs = require('fs');
const {Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let options = new chrome.Options();
options.addArguments("headless");  //this doesnt really change anything just makes the browser not open visually when running

let productType = ["Bumpers", "Suspension", "BrakePads", "Clutches", "Engine", "Catalyst", "Downpipes", "Wheels", "InteriorTrim"]
let productTypeLink = ["product-category/body/bumpers/", "product-category/suspension/air-suspension/", "product-category/brakes/brake-pads/", "product-category/powertrain/clutches/", "product-category/powertrain/engine/", "product-category/exhaust/catalysts/",  "product-category/exhaust/downpipes/", "brand/brixton-forged/", "product-category/interior/trim/"];
let pIDnum = 0;

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

function randquantity(min, max){
    let quantity = Math.floor(Math.random() * (max - min + 1)) + min;
    return quantity;
}

async function scrapeProductData() {

    //WEBSCRAPING FIRST WEBSITE HERE
    //============================//
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build(); 
    let products = [];
    let p = 0;

    for (let i = 0; i < productType.length; i++){
        pIDnum = pIDnum - 6; //for some unexplained reason this is necessary as otherwise pIDnum will be offest by 7 each time product type switches
        while (true){
            p++;
            await driver.get(`https://bulletproofautomotive.com/${productTypeLink[i]}page/${p}/`); //First site that will be scraped. Most resources come from here.
            
            //checks if page exists. if not break. if yes continue.
            try{
                await driver.findElement(By.css('body'));
            } 
            catch(error){
                console.error("bulletproofautomative site was not accessed");
                break;
            }
            
            //checks if error page found. if not continue. if yes break.
            try{
                let errorcheck = await driver.findElement(By.css('.text-brand'));
                let errorr = await errorcheck.getText();
                console.log(errorr);
                if (errorr == "NOT FOUND"){
                    p = 0;
                    break;
                }
            } 
            catch(error){
                //do nothing (continue running code)
            }

            //filter by css class so no need to parse large amounts of text
            const productNames = await driver.findElements(By.css('.font-oswald.font-bold.group-hover\\:text-brand.transition-colors'));  
            const productPrices = await driver.findElements(By.css('.text-brand.font-bold.mb-1'));
            
            let productCategory = productType[i];

            //fill product array with necessary components
            for (let j = 0; j < productNames.length; j++) {
                pIDnum++;
                let name = await productNames[j].getText();
                let price = await productPrices[j].getText();
                let pID = `P${String(pIDnum).padStart(16, '0')}`;
                
                //Creates a realistic random number for quantity in stock depeding on the product type
                //Should be noted that the quntity is relatively low since all these products are very high end and not normally mass produced
                switch(productCategory){
                    case "Bumpers":
                        quantity = randquantity(0,20);
                        break;
                    case "Suspension": 
                        quantity = randquantity(0,30);
                        break;
                    case "BrakePads":
                        quantity = randquantity(0,200);
                        break;
                    case "Clutches":
                        quantity = randquantity(0,10);
                        break;
                    case "Engine":
                        quantity = randquantity(0,5);
                        break;
                    case "Catalyst":
                        quantity = randquantity(0,10);
                        break;
                    case "Downpipes":
                        quantity = randquantity(0,200);
                        break;
                    case "Wheels":
                        quantity = randquantity(0,200);
                        break;
                    case "InteriorTrim":
                        quantity = randquantity(0,50);
                        break;
                    default:
                        quantity = 'N/A';
                }

                //formatting
                let quantityString = quantity;
                if (price.includes('–')) {
                    let prices = price.split('–').map(price => parseFloat(price.replace(/[^0-9.-]+/g,"")));   //some prices are written as a range so we take average
                    price = '$' + ((prices[0] + prices[1]) / 2).toFixed(2);
                }
                if (price.includes(' ')){
                    let prices = price.split(/–| /).map(price => parseFloat(price.replace(/[^0-9.-]+/g,"")));  //some prices are written as a range but weirder so we take average
                    price = '$' + ((prices[0] + prices[1]) / 2).toFixed(2);
                }
                if (name && price) {
                    products.push({productID: pID, productType: productCategory, name: name, price: price, quantity: quantityString});
                }
            }
        }
        
    }

    //WEBSCRAPING SECOND WEBSITE HERE
    //==============================//
    p = -1;
    let tireProductCategory = "Tires";
    
    while (true){
        p++;
        await driver.get(`https://www.discounttiredirect.com/tires/all-season-catalog?q=%3AbestSeller-asc&page=${p}`)

        //this website takes a bit to load all the elements so we must wait for the site to load before scraping
        await sleep(800); 
        
        //checks if page exists. if not break. if yes continue.
        try{
            await driver.findElement(By.css('body'));
        } 
        catch(error){
            console.error("DiscountTires site was not accessed");
            break;
        }
        
        //checks if error page found. if not continue. if yes break.
        try{
            await driver.findElement(By.css('.product-list-image__image-link___3MKF1'));
            //console.log("yippie");
        } 
        catch(error){
            console.error("NOT FOUND");
            break;
        }

        //filter by css class so no need to parse large amounts of text
        const tireProductNames = await driver.findElements(By.css('.product__product-name___2Hvwo '));
        const tireProductPrices = await driver.findElements(By.css('.price__price-block___-QS-8.price__is-numeric___1xgPo'));
        
        //fill product array with necessary components
        for (let j = 0; j < tireProductNames.length; j++) {
            pIDnum++;
            let name = await tireProductNames[j].getText();
            let price = await tireProductPrices[j].getText();
            let pID = `P${String(pIDnum).padStart(16, '0')}`;
            
            //formatting 
            name = name.replace(/\n/g, ' ');
            price = price.replace('/ea', '');

            if (price.includes('-')) {
                let prices = price.split('-').map(price => parseFloat(price.replace(/[^0-9.-]+/g,"")));
                price = '$' + ((prices[0] + prices[1]) / 2).toFixed(2); // calculating the average of the price range
            }

            //creating a realistic random number quantity for the tires
            if (tireProductCategory == "Tires"){
                quantity = randquantity(0, 500);
            }
            let quantityString = quantity;
            if (name && price) {
                products.push({productID: pID, productType: tireProductCategory, name: name, price: price, quantity: quantityString});
            }
        }
    }
    
    //writing all product data to txt file
    fs.writeFileSync('databases/productDB/products.txt', JSON.stringify(products, null, 4));    

    await driver.quit();
}

scrapeProductData();
