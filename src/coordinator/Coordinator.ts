import Intelligence from "../Intelligence";
import Thread from "../Thread";
import {Briefing} from "../types";
import {Checklist, Checkpoint} from "../ooda";

export class Coordinator
{
    constructor(readonly intelligence: Intelligence, readonly briefing: Briefing, readonly thread: Thread)
    {
    }

    async getChecklist(narrative: string): Promise<Checklist>
    {
        this.thread.addBriefing(this.briefing.strategy, this.briefing.planning);
        this.thread.addScenario(narrative);
        return new Checklist(
            (await this.intelligence.getCheckpointsProperties(this.thread))
                .map(checkpointProperties => new Checkpoint(checkpointProperties.name, checkpointProperties))
        );
    }
}
