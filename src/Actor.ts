import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import Browser from "./Browser";
import Intelligence from "./Intelligence";
import Breadcrumbs from "./Breadcrumbs";
import {
    Briefing,
    ContextProperties,
    CheckpointProperties,
} from "./types";
import Thread from "./Thread";
import {
    Ooda,
    Context,
} from "./ooda";
import {Toolbox} from "./toolbox";
import {Open} from "./tools/Open";
import {Click} from "./tools/Click";
import {Close} from "./tools/Close";
import {Wait} from "./tools/Wait";
import {Act, Conclude, Decide, Observe, Orient, Preface} from "./handlers";
import {Coordinator} from "./coordinator";
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
        const coordinator = new Coordinator(this.intelligence, briefing, thread);
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
        const checklist = await coordinator.getChecklist(narrative);

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
        });
    }
}
