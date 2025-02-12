import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Intelligence from "./Intelligence";
import Breadcrumbs from "./Breadcrumbs";
import readline = require("readline/promises");
import {Browser, Builder} from "selenium-webdriver";
import {
    Briefing,
    ContextProperties,
    DecisionProperties,
    ObservationProperties,
    OrientationProperties,
    CheckpointProperties,
} from "./types";
import Thread from "./Thread";
import Narration from "./Narration";
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
import {Toolbox} from "./Toolbox";

@injectable()
export default class Actor
{
    constructor(
        @inject(dependencies.WebDriverBuilder) private webDriverBuilder: Builder,
        @inject(dependencies.Intelligence) private intelligence: Intelligence,
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
                intelligence: this.intelligence,
                toolbox: new Toolbox(),
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
                context: {properties: {intelligence, briefing, thread}},
                scenario: {properties: narrative},
            }: FrameParameters<ContextProperties, string>) => {
                thread.addBriefing(briefing.strategy, briefing.planning);
                thread.addScenario(narrative);
                return (await intelligence.getCheckpointsProperties(thread))
                    .map(checkpointProperties => new Checkpoint(checkpointProperties.name, checkpointProperties));
            },
            preface: async ({
                context: {properties: {briefing, thread}},
            }: PrefaceParameters<ContextProperties>) => {
                thread.addBriefing(briefing.execution);
            },
            observe: async ({
                context: {properties: {driver, breadcrumbs}},
                checkpoint,
            }: ObserveParameters<ContextProperties, CheckpointProperties>) => {
                return new Observation<ObservationProperties>({
                    pageUrl: driver
                        ? await driver.getCurrentUrl()
                        : null,
                    pageScreenshotUrl: process.env.OBSERVATION_MODE === "automatic"
                        ? driver
                            ? (await breadcrumbs.addScreenshot(await driver.takeScreenshot())).url
                            : null
                        : null,
                    pageDescription: process.env.OBSERVATION_MODE === "automatic"
                        ? null
                        : await this.getScreenDescription(checkpoint),
                });
            },
            orient: async ({
                context: {properties: {intelligence, thread}},
                checkpoint,
                observation,
            }: OrientParameters<ContextProperties, CheckpointProperties, ObservationProperties>) => {
                const data: OrientationProperties = JSON.parse(await intelligence.think(thread, new Narration(checkpoint.properties, observation.properties)));
                return new Orientation(data.completed, data);
            },
            decide: async ({
                context: {properties: {intelligence, thread}},
                checkpoint,
                observation,
            }: DecideParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties>) => {
                return new Decision({
                    actions: await intelligence.act(thread, new Narration(checkpoint.properties, observation.properties)),
                });
            },
            act: async ({
                context: {properties: {driver, breadcrumbs, thread, toolbox}},
                decision: {properties: {actions}},
            }: ActParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties>) => {
                for (const action of actions) {
                    if (action.name === "open") {
                        const parameters: {url: string} = action.parameters;
                        await toolbox.open(parameters.url, driver, breadcrumbs);
                        thread.addToolMessage(`Requested page was opened.`, action.id);
                    } else if (action.name === "click") {
                        const parameters: {x: number, y: number} = action.parameters;
                        await toolbox.click(parameters.x, parameters.y, driver, breadcrumbs);
                        thread.addToolMessage(`Click was performed.`, action.id);
                    } else if (action.name === "close") {
                        await toolbox.close(driver);
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
}
