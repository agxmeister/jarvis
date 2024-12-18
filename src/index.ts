import {Builder, Browser} from "selenium-webdriver";
import OpenAI from "openai";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";

const test = async () => {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get('https://test.agxmeister.services/');

    const actions = driver.actions({async: true});

    await driver.sleep(1000);
    await actions.move({x: 100, y: 150}).perform();
    await actions.click().perform();
    await driver.sleep(1000);

    const breadcrumbs = new Breadcrumbs();
    const screenshot = await breadcrumbs.addScreenshot((await driver.takeScreenshot()));

    const prophet = new Prophet(new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    }));

    await prophet.describeScreenshot(screenshot.url);

    await driver.quit();
}

test();
