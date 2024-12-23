import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import {WebDriver} from "selenium-webdriver";
import {Screenshot} from "./types";
import {ChatCompletionMessage} from "openai/resources/chat/completions";

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
        /*await this.driver.get('https://test.agxmeister.services/');

        const actions = this.driver.actions({async: true});

        await this.driver.sleep(1000);
        await actions.move({x: 100, y: 150}).perform();
        await actions.click().perform();
        await this.driver.sleep(1000);

        const screenshot = await this.breadcrumbs.addScreenshot((await this.driver.takeScreenshot()));*/

        const url = "https://test.agxmeister.services";
        const instruction = `Your task is to open "${url}" in browser and then click on coordinates (100, 150)`;

        const tools = {
            open: (url: string) => this.open(url),
            close: () => this.close(),
            click: (x: number, y: number) => this.click(x, y),
        };

        const message = await this.prophet.appeal(instruction);

        await this.handle(message);

        //await this.driver.quit();
    }

    private async handle(reply: ChatCompletionMessage)
    {
        if (!reply.tool_calls) {
            return;
        }
        const call = reply.tool_calls.pop();
        if (call.function.name === "open") {
            await this.open(call.function.arguments["url"]);
        }
    }

    private async open(url: string): Promise<Screenshot>
    {
        await this.driver.get('https://test.agxmeister.services/');
        return await this.breadcrumbs.addScreenshot((await this.driver.takeScreenshot()));
    }

    private async click(x: number, y: number): Promise<Screenshot>
    {
        const actions = this.driver.actions({async: true});
        await actions.move({x: x, y: y}).perform();
        await actions.click().perform();
        return await this.breadcrumbs.addScreenshot((await this.driver.takeScreenshot()));
    }

    private async close(): Promise<void>
    {
        await this.driver.quit();
    }
}
