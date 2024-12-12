import {Builder, Browser} from "selenium-webdriver";
import * as fs from "node:fs";
import OpenAI from "openai";
import Prophet from "./Prophet";

const test = async () => {
    console.log("Hello, world!");
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get('https://test.agxmeister.services/');

    const actions = driver.actions({async: true});

    await driver.sleep(1000);
    await actions.move({x: 100, y: 150}).perform();
    await actions.click().perform();
    await driver.sleep(1000);

    const screenshot = await driver.takeScreenshot();

    fs.writeFile('screenshot.png', screenshot, 'base64', () => {
        console.log('Screenshot was taken!');
    });

    const prophet = new Prophet(new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    }));

    await prophet.describeScreenshot(screenshot);

    console.log('Click!');

    await driver.quit();
}

test();