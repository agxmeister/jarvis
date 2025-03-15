import {inject} from "inversify";
import {dependencies} from "./dependencies";
import {Builder, WebDriver, Browser as WebDriverBrowser} from "selenium-webdriver";

export default class Browser
{
    private page: WebDriver;
    constructor(
        @inject(dependencies.WebDriverBuilder) private builder: Builder,
    ) {
    }

    async getCurrentPage(): Promise<WebDriver>
    {
        if (!this.page) {
            this.page = await this.builder.forBrowser(WebDriverBrowser.CHROME).build();
        }
        return this.page;
    }

    isCurrentPage(): boolean
    {
        return !!this.page;
    }

    async open(url: string): Promise<WebDriver>
    {
        const page = await this.getCurrentPage();
        await page.get(url);
        return page;
    }

    async close(): Promise<void>
    {
        if (!this.page) {
            return;
        }
        await (await this.getCurrentPage()).close();
    }
}
