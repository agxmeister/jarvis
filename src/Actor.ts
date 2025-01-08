import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import {Browser, Builder, WebDriver} from "selenium-webdriver";
import {OrientMessage, Screenshot, Step, Tool} from "./types";
import Scenario from "./Scenario";
import readline = require("readline/promises");

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

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            console.log(`Starting step ${step.name}`);

            let completed = false;

            for (let j = 0; j < 5; j++) {
                console.log(`Expectation: ${step.expectation}`);

                step.observation = await this.askForObservation(step);

                await this.observe(step, this.webDriver);

                const message = await this.orient();

                console.log(`Observation: ${message.observation}`);
                console.log(`Observation: ${message.comment}`);

                completed = completed || message.completed;
                if (completed) {
                    console.log(`Total iterations: ${j}.`);
                    break;
                }

                const tools = await this.decide();

                await this.act(tools);
            }

            if (!completed) {
                console.log(`Scenario failed on ${step.name}.`);
                break;
            }

            console.log(`Step ${step.name} completed!`);
        }
    }

    async askForObservation(step: Step): Promise<string>
    {
        const request = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const answer = await request.question(`Current step is "${step.name}". What do you see? `);
        request.close();
        return answer;
    }

    async observe(step: Step, driver: WebDriver)
    {
        this.prophet.cleanNarratorMessages();
        this.prophet.addNarratorStepMessage(step);
        const currentUrl = driver ? await driver.getCurrentUrl() : null;
        if (!step.observation) {
            const screenshot = driver ? await this.breadcrumbs.addScreenshot((await driver.takeScreenshot())) : null;
            this.prophet.addNarratorObservationMessage(currentUrl, screenshot?.url);
        } else {
            this.prophet.addNarratorEmulatedObservationMessage(step.observation, currentUrl);
        }
    }

    async orient(): Promise<OrientMessage>
    {
        const message = await this.prophet.think();
        this.prophet.addAssistantMessage(message);
        return JSON.parse(message);
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
                this.prophet.addToolMessage(`Requested page was opened.`, tool.id);
            } else if (tool.name === "click") {
                const parameters: {x: number, y: number} = tool.parameters;
                await this.click(parameters.x, parameters.y);
                this.prophet.addToolMessage(`Click was performed.`, tool.id);
            } else if (tool.name === "close") {
                await this.close();
                this.prophet.addToolMessage(`Browser was closed.`, tool.id);
            } else if (tool.name === "wait") {
                this.prophet.addToolMessage(`Some time passed.`, tool.id);
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
