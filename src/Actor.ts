import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import {WebDriver} from "selenium-webdriver";

@injectable()
export default class Actor
{
    constructor(
        @inject(dependencies.WebDriver) private driver: WebDriver,
        @inject(dependencies.Prophet) private prophet: Prophet,
        @inject(dependencies.Breadcrumbs) private breadcrumbs: Breadcrumbs,
    )
    {
    }

    public async act(): Promise<void>
    {
        await this.driver.get('https://test.agxmeister.services/');

        const actions = this.driver.actions({async: true});

        await this.driver.sleep(1000);
        await actions.move({x: 100, y: 150}).perform();
        await actions.click().perform();
        await this.driver.sleep(1000);

        const screenshot = await this.breadcrumbs.addScreenshot((await this.driver.takeScreenshot()));

        await this.prophet.describeScreenshot(screenshot.url);

        await this.driver.quit();
    }
}
