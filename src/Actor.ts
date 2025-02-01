import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import readline = require("readline/promises");
import {Browser, Builder, WebDriver} from "selenium-webdriver";
import {
    ContextProperties,
    DecisionProperties,
    ObservationProperties,
    OrientationProperties,
    Screenshot,
    CheckpointProperties
} from "./types";
import Scenario from "./Scenario";
import Thread from "./Thread";
import Narrator from "./Narrator";
import {
    Ooda,
    Checkpoint,
    Context,
    Observation,
    Orientation,
    Decision,
    ObserveParameters,
    OrientParameters,
    DecideParameters,
    ActParameters,
} from "./ooda";

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
        const context = new Context<ContextProperties>({
            driver: this.webDriver,
            breadcrumbs: this.breadcrumbs,
            prophet: this.prophet,
            thread: thread,
        });

        thread.addMasterMessage(scenario.briefing.strategy);
        thread.addMasterMessage(scenario.briefing.planning);
        thread.addMessengerMessage(scenario.narrative);

        const checkpoints = (await this.prophet.getCheckpointsProperties(thread))
            .map(checkpointProperties => new Checkpoint(checkpointProperties.name, checkpointProperties));

        thread.addMasterMessage(scenario.briefing.execution);

        const ooda = this.getOoda();
        await ooda.process(context, checkpoints);
    }

    private getOoda(): Ooda
    {
        return new Ooda(
            async ({
                context: {properties: {driver, breadcrumbs}},
                checkpoint,
            }: ObserveParameters<ContextProperties, CheckpointProperties>) => {
                const narrator = new Narrator();
                narrator.addStep(checkpoint);
                const currentUrl = driver ? await driver.getCurrentUrl() : null;
                if (process.env.OBSERVATION_MODE !== "automatic") {
                    narrator.addManualObservation(currentUrl, await this.getScreenDescription(checkpoint));
                    return new Observation({
                        narrator: narrator,
                    });
                }
                const screenshot = driver ? await breadcrumbs.addScreenshot(await driver.takeScreenshot()) : null;
                narrator.addAutomaticObservation(currentUrl, screenshot?.url);
                return new Observation({
                    narrator: narrator,
                });
            },
            async ({
                context: {properties: {prophet, thread}},
                observation: {properties: {narrator}},
            }: OrientParameters<ContextProperties, CheckpointProperties, ObservationProperties>) => {
                const data: OrientationProperties = JSON.parse(await prophet.think(thread, narrator));
                return new Orientation(data.completed, data);
            },
            async ({
                context: {properties: {prophet, thread}},
                observation: {properties: {narrator}},
            }: DecideParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties>) => {
                return new Decision({
                    actions: await prophet.act(thread, narrator),
                });
            },
            async ({
                context: {properties: {thread}},
                decision: {properties: {actions}},
            }: ActParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties>) => {
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
            },
        );
    }

    async getScreenDescription(checkpoint: Checkpoint<CheckpointProperties>): Promise<string>
    {
        const request = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const answer = await request.question(`Current step is "${checkpoint.properties.name}". What do you see? `);
        request.close();
        return answer;
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
