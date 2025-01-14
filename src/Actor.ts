import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import {Browser, Builder, WebDriver} from "selenium-webdriver";
import {Orientation, Screenshot, Step, Action} from "./types";
import Scenario from "./Scenario";
import readline = require("readline/promises");
import Thread from "./Thread";
import Observation from "./Observation";
import Ooda from "./Ooda";
import Decision from "./Decision";

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

        const ooda = this.getOoda();

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            console.log(`Starting step ${step.name}`);

            const completed = await ooda.process(thread, step);
            if (!completed) {
                console.log(`Scenario failed on ${step.name}.`);
                break;
            }

            console.log(`Step ${step.name} completed!`);
        }
    }

    private getOoda(): Ooda
    {
        return new Ooda(
            async (step: Step) => this.observe(step, this.webDriver),
            async (thread: Thread, observation: Observation) => await this.orient(thread, observation),
            async (thread: Thread, observation: Observation) => await this.decide(thread, observation),
            async (thread: Thread, actions: Action[]) => await this.act(thread, actions),
        );
    }

    async observe(step: Step, driver: WebDriver): Promise<Observation>
    {
        const observation = new Observation();
        observation.addStep(step);
        const currentUrl = driver ? await driver.getCurrentUrl() : null;
        if (process.env.OBSERVATION_MODE !== "automatic") {
            observation.addManualObservation(currentUrl, await this.getScreenDescription(step));
            return observation;
        }
        const screenshot = driver ? await this.breadcrumbs.addScreenshot(await driver.takeScreenshot()) : null;
        observation.addAutomaticObservation(currentUrl, screenshot?.url);
        return observation;
    }

    async getScreenDescription(step: Step): Promise<string>
    {
        const request = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const answer = await request.question(`Current step is "${step.name}". What do you see? `);
        request.close();
        return answer;
    }

    async orient(thread: Thread, observation: Observation): Promise<Orientation>
    {
        const message = await this.prophet.think(thread, observation);
        return JSON.parse(message);
    }

    async decide(thread: Thread, observation: Observation): Promise<Decision>
    {
        return await this.prophet.act(thread, observation);
    }

    async act(thread: Thread, actions: Action[])
    {
        for (const action of actions) {
            if (action.name === "open") {
                const parameters: {url: string} = action.parameters;
                await this.open(parameters.url);
                thread.addToolMessage(`Requested page was opened.`, action.id);
            } else if (action.name === "click") {
                const parameters: {x: number, y: number} = action.parameters;
                await this.click(parameters.x, parameters.y);
                thread.addToolMessage(`Click was performed.`, action.id);
            } else if (action.name === "close") {
                await this.close();
                thread.addToolMessage(`Browser was closed.`, action.id);
            } else if (action.name === "wait") {
                thread.addToolMessage(`Some time passed.`, action.id);
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
