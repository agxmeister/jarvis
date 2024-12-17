import {Builder, Browser} from "selenium-webdriver";
import OpenAI from "openai";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";

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
    const breadcrumbs = new Breadcrumbs();
    const screenshotId = await breadcrumbs.addScreenshot(Buffer.from(screenshot, 'base64'));
    const screenshotUrl = `https://breadcrumbs.agxmeister.services/screenshots/${screenshotId}`;

    console.log(`Screenshot URL: ${screenshotUrl}`);

    const prophet = new Prophet(new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    }));

    await prophet.describeScreenshot(screenshotUrl);

    console.log('Click!');

    await driver.quit();
}

test();
