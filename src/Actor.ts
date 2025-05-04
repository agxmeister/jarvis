import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Browser from "./Browser";
import Breadcrumbs from "./Breadcrumbs";
import {
    Briefing,
    ContextProperties,
    CheckpointProperties,
} from "./types";
import {
    Ooda,
    Context,
} from "./ooda";
import {Intelligence, Thread} from "./intelligence";
import {Toolbox} from "./toolbox";
import {Open} from "./tools/Open";
import {Click} from "./tools/Click";
import {Close} from "./tools/Close";
import {Wait} from "./tools/Wait";
import {Act, Conclude, Decide, Observe, Orient, Gatekeeper, Preface} from "./frame";
import {getChecklist} from "./utils";
import {Runtime} from "./tools/types";

@injectable()
export default class Actor
{
    constructor(
        @inject(dependencies.Browser) private browser: Browser,
        @inject(dependencies.Intelligence) private intelligence: Intelligence,
        @inject(dependencies.Breadcrumbs) private breadcrumbs: Breadcrumbs,
    )
    {
    }

    public async process(briefing: Briefing, narrative: string): Promise<void>
    {
        const thread = new Thread();
        const context: Context<ContextProperties> = {
            browser: this.browser,
            breadcrumbs: this.breadcrumbs,
            intelligence: this.intelligence,
            thread: thread,
            briefing: briefing,
        };
        const toolbox: Toolbox<Runtime> = {
            tools: [Open, Click, Close, Wait],
        };
        const checklist = await getChecklist(narrative, briefing, this.intelligence, thread);

        const ooda = this.getOoda();
        await ooda.process(
            context,
            toolbox,
            checklist,
        );
    }

    private getOoda(): Ooda<ContextProperties, CheckpointProperties, Runtime>
    {
        return new Ooda({
            preface: Preface,
            observe: Observe,
            orient: Orient,
            decide: Decide,
            act: Act,
            conclude: Conclude
        }, {
            orient: [Gatekeeper],
        });
    }
}
