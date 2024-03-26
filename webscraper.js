const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

async function scrapeFAQs() {
    let options = new chrome.Options();
    options.addArguments('--headless'); // Set Chrome to run in headless mode

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    
    try {
        await driver.get('https://www.discounttiredirect.com/customer-service/faqs');

        // Use the generalized XPath expression to target all FAQ answer elements
        const answerElements = await driver.findElements(By.xpath('/html/body/main/div[2]/div[2]/p'));

        let faqText = '';
        for (const answerElement of answerElements) {
            faqText += (await answerElement.getText()).trim() + '\n';
        }
        
        // Write all FAQ answers to a new file
        fs.writeFileSync('scraped_faq.txt', faqText.trim());
        console.log('All FAQ answers have been successfully scraped and saved to scraped_faq.txt');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await driver.quit();
    }
}

scrapeFAQs();
