import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import {Browser, Builder, WebDriver} from "selenium-webdriver";
import {ContextProperties, ObservationProperties, Orientation, Screenshot, StageProperties} from "./types";
import Scenario from "./Scenario";
import readline = require("readline/promises");
import Thread from "./Thread";
import Observation from "./Observation";
import Ooda from "./Ooda";
import Decision from "./Decision";
import Context from "./Context";
import Narrator from "./Narrator";
import Stage from "./Stage";

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

        const stages = (await this.prophet.getStagesProperties(thread)).map(stageProperties => new Stage(stageProperties));

        thread.addMasterMessage(scenario.briefing.execution);

        const ooda = this.getOoda();
        await ooda.process(context, stages);
    }

    private getOoda(): Ooda
    {
        return new Ooda(
            async ({properties: {driver, breadcrumbs}}: Context<ContextProperties>, stage: Stage<StageProperties>) => {
                const narrator = new Narrator();
                narrator.addStep(stage);
                const currentUrl = driver ? await driver.getCurrentUrl() : null;
                if (process.env.OBSERVATION_MODE !== "automatic") {
                    narrator.addManualObservation(currentUrl, await this.getScreenDescription(stage));
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
            async (
                {properties: {prophet, thread}}: Context<ContextProperties>,
                {properties: {narrator}}: Observation<ObservationProperties>
            ) => JSON.parse(await prophet.think(thread, narrator)),
            async (
                {properties: {prophet, thread}}: Context<ContextProperties>,
                {properties: {narrator}}: Observation<ObservationProperties>,
                _: Orientation,
            ) => await prophet.act(thread, narrator),
            async ({properties: {thread}}: Context<ContextProperties>, decision: Decision) => {
                for (const action of decision.actions) {
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

    async getScreenDescription(stage: Stage<StageProperties>): Promise<string>
    {
        const request = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const answer = await request.question(`Current step is "${stage.properties.name}". What do you see? `);
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
