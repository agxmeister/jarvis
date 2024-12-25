import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import {WebDriver} from "selenium-webdriver";
import {Screenshot, Tool} from "./types";
import {ChatCompletionMessage} from "openai/resources/chat/completions";
import * as fs from "node:fs";

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

    async observe()
    {
        this.prophet.addNarratorMessage();
    }

    async orient()
    {
        const message = await this.prophet.think();
        this.prophet.addAssistantMessage(message);
    }

    async decide(): Promise<Tool[]>
    {
        return await this.prophet.act();
    }

    public async process(): Promise<void>
    {
        const instruction = fs.readFileSync("./data/instruction.md", {encoding: "utf-8"});
        const scenario = fs.readFileSync("./data/scenario.md", {encoding: "utf-8"});

        /*await this.driver.get('https://test.agxmeister.services/');

        const actions = this.driver.actions({async: true});

        await this.driver.sleep(1000);
        await actions.move({x: 100, y: 150}).perform();
        await actions.click().perform();
        await this.driver.sleep(1000);

        const screenshot = await this.breadcrumbs.addScreenshot((await this.driver.takeScreenshot()));*/

        this.prophet.addDungeonMasterMessage(instruction);
        this.prophet.addMessengerMessage(scenario);

        await this.observe();
        await this.orient();
        const tools = await this.decide();
        await this.act(tools);

        //await this.driver.quit();
    }

    async act(tools: Tool[])
    {
        for (const tool of tools) {
            if (tool.name === "open") {
                const parameters: {url: string} = tool.parameters;
                await this.open(parameters.url);
            }
        }
    }

    private async open(url: string): Promise<Screenshot>
    {
        await this.driver.get(url);
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
