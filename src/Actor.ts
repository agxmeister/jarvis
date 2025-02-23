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
    Tool,
    ToolHandlerOpenParameters,
    ToolHandlerClickParameters,
    ToolHandlerCloseParameters,
    ToolHandlerWaitParameters,
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
import Toolbox from "./Toolbox";

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
                thread: new Thread(),
                briefing: briefing,
            }),
            new Toolbox(this.getTools()),
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
                toolbox,
                checkpoint,
                observation,
            }: OrientParameters<ContextProperties, CheckpointProperties, ObservationProperties>) => {
                const data: OrientationProperties = JSON.parse(await intelligence.think(thread, new Narration(checkpoint.properties, observation.properties), toolbox));
                return new Orientation(data.completed, data);
            },
            decide: async ({
                context: {properties: {intelligence, thread}},
                toolbox,
                checkpoint,
                observation,
            }: DecideParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties>) => {
                return new Decision({
                    actions: await intelligence.act(thread, new Narration(checkpoint.properties, observation.properties), toolbox),
                });
            },
            act: async ({
                context,
                toolbox,
                decision: {properties: {actions}},
            }: ActParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties>) => {
                for (const action of actions) {
                    await toolbox.apply(action.name, action.parameters, action.id, context);
                }
            },
            conclude: async ({context: {properties: {driver}}}: PrefaceParameters<ContextProperties>) => {
                if (driver) {
                    await driver.quit();
                }
            }
        });
    }

    private getTools(): Tool[]
    {
        return [{
            name: "open",
            description: "Open the given URL on browser's screen.",
            handler: async (id: string, context: Context<ContextProperties>, parameters: ToolHandlerOpenParameters): Promise<void> => {
                await context.properties.driver.get('https://example.com');
                await context.properties.driver.manage().window().setRect({
                    width: 800,
                    height: 600,
                });
                await context.properties.driver.get(parameters.url);
                context.properties.thread.addToolMessage(`Requested page was opened.`, id);
            },
            parameters: {
                type: "object",
                properties: {
                    url: {
                        type: "string",
                        description: "URL to open in browser.",
                    },
                },
                required: ["url"],
            },
        }, {
            name: "click",
            description: "On the current browser's screen move the mouse pointer to specified coordinates and click.",
            handler: async (id: string, context: Context<ContextProperties>, parameters: ToolHandlerClickParameters): Promise<void> => {
                const actions = context.properties.driver.actions({async: true});
                await actions.move({x: parameters.x, y: parameters.y}).perform();
                await actions.click().perform();
                context.properties.thread.addToolMessage(`Click was performed.`, id);
            },
            parameters: {
                type: "object",
                properties: {
                    x: {
                        type: "integer",
                        description: "The X coordinate to click",
                    },
                    y: {
                        type: "integer",
                        description: "The Y coordinate to click",
                    },
                },
                required: ["x", "y"],
            }
        }, {
            name: "close",
            description: "Close the browser's screen.",
            handler: async (id: string, context: Context<ContextProperties>, _: ToolHandlerCloseParameters): Promise<void> => {
                await context.properties.driver.quit();
                context.properties.thread.addToolMessage(`Browser was closed.`, id);
            },
            parameters: {},
        }, {
            name: "wait",
            description: "Do nothing.",
            handler: async (id: string, context: Context<ContextProperties>, _: ToolHandlerWaitParameters): Promise<void> => {
                context.properties.thread.addToolMessage(`Some time passed.`, id);
            },
            parameters: {},
        }];
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
