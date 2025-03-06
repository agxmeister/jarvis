import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Intelligence from "./Intelligence";
import Breadcrumbs from "./Breadcrumbs";
import {Browser, Builder} from "selenium-webdriver";
import {
    Briefing,
    ContextProperties,
} from "./types";
import Thread from "./Thread";
import {
    Ooda,
    Scenario,
    Context,
} from "./ooda";
import {Toolbox} from "./ooda/toolbox";
import {Open} from "./tools/Open";
import {Click} from "./tools/Click";
import {Close} from "./tools/Close";
import {Wait} from "./tools/Wait";
import {Act, Conclude, Decide, Frame, Observe, Orient, Preface} from "./handlers";

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
            new Toolbox([Open, Click, Close, Wait]),
            new Scenario<string>(narrative),
        );
    }

    private getOoda(): Ooda
    {
        return new Ooda({
            frame: Frame,
            preface: Preface,
            observe: Observe,
            orient: Orient,
            decide: Decide,
            act: Act,
            conclude: Conclude
        });
    }
}
