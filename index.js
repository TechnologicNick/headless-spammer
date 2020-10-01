const chrome = require('selenium-webdriver/chrome');
// const firefox = require('selenium-webdriver/firefox');
const {Builder, By, Key, until, WebElement} = require('selenium-webdriver');
const readline = require('readline');

const screen = {
    width: 640,
    height: 480
};

let drivers = [];

function newInstance() {
    return new Promise(async (resolve, reject) => {
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(new chrome.Options().headless().addArguments("--disable-gpu").windowSize(screen))
            // .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
            .build();

        drivers.push(driver);
        try {
            await driver.get("https://example.com/");
            resolve();
        } catch(e) {
            reject(e);
        } finally {
            //await driver.quit();
        }
    });
}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

(async () => {
    let promises = []
    for(let i = 0; i < 300; i++) {
        promises.push(newInstance());
        await new Promise(r => setTimeout(r, 500));
    }
    await Promise.all(promises);

    while(await askQuestion("Type \"stop\" to stop: ") !== "stop") {}

    promises = []
    for(let i in drivers) {
        console.log("quit", i);
        promises.push(drivers[i].quit());
    }
    await Promise.all(promises);

    console.log("Done");
})();