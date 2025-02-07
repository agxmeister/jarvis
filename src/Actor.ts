import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import readline = require("readline/promises");
import {Browser, Builder, WebDriver} from "selenium-webdriver";
import {
    Briefing,
    Screenshot,
    ContextProperties,
    DecisionProperties,
    ObservationProperties,
    OrientationProperties,
    CheckpointProperties,
} from "./types";
import Thread from "./Thread";
import Narrator from "./Narrator";
import {
    Ooda,
    Checkpoint,
    Scenario,
    Context,
    Observation,
    Orientation,
    Decision,
    ObserveParameters,
    OrientParameters,
    DecideParameters,
    ActParameters,
} from "./ooda";
import {FrameParameters, PrefaceParameters} from "./ooda/types";

@injectable()
export default class Actor
{
    constructor(
        @inject(dependencies.WebDriverBuilder) private webDriverBuilder: Builder,
        @inject(dependencies.Prophet) private prophet: Prophet,
        @inject(dependencies.Breadcrumbs) private breadcrumbs: Breadcrumbs,
    )
    {
    }

    public async process(briefing: Briefing, narrative: string): Promise<void>
    {
        const ooda = this.getOoda();
        await ooda.process(
            new Context<ContextProperties>({
                driver: await this.webDriverBuilder
                    .forBrowser(Browser.CHROME)
                    .build(),
                breadcrumbs: this.breadcrumbs,
                prophet: this.prophet,
                thread: new Thread(),
                briefing: briefing,
            }),
            new Scenario<string>(narrative),
        );
    }

    private getOoda(): Ooda
    {
        return new Ooda({
            frame: async ({
                context: {properties: {prophet, briefing, thread}},
                scenario: {properties: narrative},
            }: FrameParameters<ContextProperties, string>) => {
                thread.addMasterMessage(briefing.strategy);
                thread.addMasterMessage(briefing.planning);
                thread.addMessengerMessage(narrative);
                return (await prophet.getCheckpointsProperties(thread))
                    .map(checkpointProperties => new Checkpoint(checkpointProperties.name, checkpointProperties));
            },
            preface: async ({
                context: {properties: {briefing, thread}},
            }: PrefaceParameters<ContextProperties>) => {
                thread.addMasterMessage(briefing.execution);
            },
            observe: async ({
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
            orient: async ({
                context: {properties: {prophet, thread}},
                observation: {properties: {narrator}},
            }: OrientParameters<ContextProperties, CheckpointProperties, ObservationProperties>) => {
                const data: OrientationProperties = JSON.parse(await prophet.think(thread, narrator));
                return new Orientation(data.completed, data);
            },
            decide: async ({
                context: {properties: {prophet, thread}},
                observation: {properties: {narrator}},
            }: DecideParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties>) => {
                return new Decision({
                    actions: await prophet.act(thread, narrator),
                });
            },
            act: async ({
                context: {properties: {driver, breadcrumbs, thread}},
                decision: {properties: {actions}},
            }: ActParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties>) => {
                for (const action of actions) {
                    if (action.name === "open") {
                        const parameters: {url: string} = action.parameters;
                        await this.open(parameters.url, driver, breadcrumbs);
                        thread.addToolMessage(`Requested page was opened.`, action.id);
                    } else if (action.name === "click") {
                        const parameters: {x: number, y: number} = action.parameters;
                        await this.click(parameters.x, parameters.y, driver, breadcrumbs);
                        thread.addToolMessage(`Click was performed.`, action.id);
                    } else if (action.name === "close") {
                        await this.close(driver);
                        thread.addToolMessage(`Browser was closed.`, action.id);
                    } else if (action.name === "wait") {
                        thread.addToolMessage(`Some time passed.`, action.id);
                    }
                }
            },
            conclude: async ({context: {properties: {driver}}}: PrefaceParameters<ContextProperties>) => {
                if (driver) {
                    await driver.quit();
                }
            }
        });
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

    private async open(url: string, driver: WebDriver, breadcrumbs: Breadcrumbs): Promise<Screenshot>
    {
        await driver.get('https://example.com');
        await driver.manage().window().setRect({
            width: 800,
            height: 600,
        });
        await driver.get(url);
        return await breadcrumbs.addScreenshot((await driver.takeScreenshot()));
    }

    private async click(x: number, y: number, driver: WebDriver, breadcrumbs: Breadcrumbs): Promise<Screenshot>
    {
        const actions = driver.actions({async: true});
        await actions.move({x: x, y: y}).perform();
        await actions.click().perform();
        return await breadcrumbs.addScreenshot((await driver.takeScreenshot()));
    }

    private async close(driver: WebDriver): Promise<void>
    {
        await driver.quit();
    }
}
