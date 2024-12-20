import {dependencies} from "./types";
import {inject, injectable} from "inversify";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import {Browser, Builder} from "selenium-webdriver";

@injectable()
export default class Actor
{
    @inject(dependencies.Prophet) private prophet: Prophet;
    @inject(dependencies.Breadcrumbs) private breadcrumbs: Breadcrumbs;

    public async act(): Promise<void>
    {
        const driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.get('https://test.agxmeister.services/');

        const actions = driver.actions({async: true});

        await driver.sleep(1000);
        await actions.move({x: 100, y: 150}).perform();
        await actions.click().perform();
        await driver.sleep(1000);

        const screenshot = await this.breadcrumbs.addScreenshot((await driver.takeScreenshot()));

        await this.prophet.describeScreenshot(screenshot.url);

        await driver.quit();
    }
}
