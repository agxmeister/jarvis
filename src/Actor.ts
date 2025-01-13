import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import {Browser, Builder, WebDriver} from "selenium-webdriver";
import {OrientMessage, Screenshot, Step, Tool} from "./types";
import Scenario from "./Scenario";
import readline = require("readline/promises");
import Thread from "./Thread";
import Narrator from "./Narrator";
import Ooda from "./Ooda";

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
        const thread = new Thread();

        thread.addMasterMessage(scenario.briefing.strategy);
        thread.addMasterMessage(scenario.briefing.planning);
        thread.addMessengerMessage(scenario.narrative);

        const steps = await this.prophet.getSteps(thread);

        thread.addMasterMessage(scenario.briefing.execution);

        const ooda = new Ooda(
            async (step: Step) => this.observe(step, this.webDriver),
            async (narrator: Narrator) => await this.orient(thread, narrator),
            async (narrator: Narrator) => await this.decide(thread, narrator),
            async (tools: Tool[]) => await this.act(thread, tools),
        );

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            console.log(`Starting step ${step.name}`);

            const completed = await ooda.process(step);
            if (!completed) {
                console.log(`Scenario failed on ${step.name}.`);
                break;
            }

            console.log(`Step ${step.name} completed!`);
        }
    }

    async observe(step: Step, driver: WebDriver): Promise<Narrator>
    {
        const narrator = new Narrator();
        narrator.addStep(step);
        const currentUrl = driver ? await driver.getCurrentUrl() : null;
        if (process.env.OBSERVATION_MODE !== "automatic") {
            const observation = await this.getObservation(step);
            narrator.addManualObservation(currentUrl, observation);
            return narrator;
        }
        const screenshot = driver ? await this.breadcrumbs.addScreenshot((await driver.takeScreenshot())) : null;
        narrator.addAutomaticObservation(currentUrl, screenshot?.url);
        return narrator;
    }

    async getObservation(step: Step): Promise<string>
    {
        const request = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const answer = await request.question(`Current step is "${step.name}". What do you see? `);
        request.close();
        return answer;
    }

    async orient(thread: Thread, narrator: Narrator): Promise<OrientMessage>
    {
        const message = await this.prophet.think(thread, narrator);
        return JSON.parse(message);
    }

    async decide(thread: Thread, narrator: Narrator): Promise<Tool[]>
    {
        return await this.prophet.act(thread, narrator);
    }

    async act(thread: Thread, tools: Tool[])
    {
        for (const tool of tools) {
            if (tool.name === "open") {
                const parameters: {url: string} = tool.parameters;
                await this.open(parameters.url);
                thread.addToolMessage(`Requested page was opened.`, tool.id);
            } else if (tool.name === "click") {
                const parameters: {x: number, y: number} = tool.parameters;
                await this.click(parameters.x, parameters.y);
                thread.addToolMessage(`Click was performed.`, tool.id);
            } else if (tool.name === "close") {
                await this.close();
                thread.addToolMessage(`Browser was closed.`, tool.id);
            } else if (tool.name === "wait") {
                thread.addToolMessage(`Some time passed.`, tool.id);
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
