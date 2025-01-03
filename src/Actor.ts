import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import {Browser, Builder, WebDriver} from "selenium-webdriver";
import {Screenshot, Step, Tool} from "./types";
import Scenario from "./Scenario";

@injectable()
export default class Actor
{
    private webDriver: WebDriver;

    constructor(
        @inject(dependencies.WebDriverBuilder) private webDriverBuilder: Builder,
        @inject(dependencies.Prophet) private prophet: Prophet,
        @inject(dependencies.Breadcrumbs) private breadcrumbs: Breadcrumbs,
    )
    {
        this.webDriver = null;
    }

    public async process(scenario: Scenario): Promise<void>
    {
        this.prophet.addDungeonMasterMessage(scenario.briefing.strategy);
        this.prophet.addDungeonMasterMessage(scenario.briefing.planning);
        this.prophet.addMessengerMessage(scenario.narrative);

        const steps = await this.prophet.getSteps();

        this.prophet.addDungeonMasterMessage(scenario.briefing.execution);

        for (const i in steps) {
            const step = steps[i];
            console.log(`Starting step ${step.name}`);

            let completed = false;

            for (let i = 0; i < 2; i++) {
                await this.observe(step, this.webDriver);
                completed = completed || await this.orient();

                const nextStep = i + 1 < steps.length ? steps[i + 1] : null;

                if (completed && nextStep) {
                    await this.observe(nextStep, this.webDriver);
                }

                if (nextStep) {
                    const tools = await this.decide();
                    await this.act(tools);
                }

                if (completed) {
                    console.log(`Total iterations: ${i}.`);
                    break;
                }
            }

            if (!completed) {
                console.log(`Failed to complete step ${step.name}`);
                break;
            }

            console.log(`Step ${step.name} completed!`);
        }
    }

    async observe(step: Step, driver: WebDriver)
    {
        this.prophet.cleanNarratorMessages();
        this.prophet.addNarratorStepMessage(step);
        const currentUrl = driver ? await driver.getCurrentUrl() : null;
        const screenshot = driver ? await this.breadcrumbs.addScreenshot((await driver.takeScreenshot())) : null;
        this.prophet.addNarratorObservationMessage(currentUrl, screenshot?.url);
    }

    async orient(): Promise<boolean>
    {
        const message = await this.prophet.think();
        this.prophet.addAssistantMessage(message);

        const data: {observation: string, completed: boolean} = JSON.parse(message);

        return data.completed;
    }

    async decide(): Promise<Tool[]>
    {
        return await this.prophet.act();
    }

    async act(tools: Tool[])
    {
        for (const tool of tools) {
            if (tool.name === "open") {
                const parameters: {url: string} = tool.parameters;
                await this.open(parameters.url);
            } else if (tool.name === "click") {
                const parameters: {x: number, y: number} = tool.parameters;
                await this.click(parameters.x, parameters.y);
            } else if (tool.name === "close") {
                await this.close();
            }
        }
    }

    private async open(url: string): Promise<Screenshot>
    {
        this.webDriver = await this.webDriverBuilder
            .forBrowser(Browser.CHROME)
            .build();
        await this.webDriver.get('https://example.com');
        await this.webDriver.manage().window().setRect({
            width: 800,
            height: 600,
        });
        await this.webDriver.get(url);
        return await this.breadcrumbs.addScreenshot((await this.webDriver.takeScreenshot()));
    }

    private async click(x: number, y: number): Promise<Screenshot>
    {
        const actions = this.webDriver.actions({async: true});
        await actions.move({x: x, y: y}).perform();
        await actions.click().perform();
        return await this.breadcrumbs.addScreenshot((await this.webDriver.takeScreenshot()));
    }

    private async close(): Promise<void>
    {
        await this.webDriver.quit();
        this.webDriver = null;
    }
}
