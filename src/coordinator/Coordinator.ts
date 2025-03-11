import Intelligence from "../Intelligence";
import Thread from "../Thread";
import {Checklist} from "../checklist";
import {Briefing, CheckpointProperties} from "../types";

export class Coordinator
{
    constructor(readonly intelligence: Intelligence, readonly briefing: Briefing, readonly thread: Thread)
    {
    }

    async getChecklist(narrative: string): Promise<Checklist<CheckpointProperties>>
    {
        this.thread.addBriefing(this.briefing.strategy, this.briefing.planning);
        this.thread.addScenario(narrative);
        return await this.intelligence.getChecklist(this.thread);
    }
}
