import Intelligence from "../Intelligence";
import Thread from "../Thread";
import {Briefing, CheckpointProperties} from "../types";
import {Checklist, Checkpoint} from "../checklist";

export class Coordinator
{
    constructor(readonly intelligence: Intelligence, readonly briefing: Briefing, readonly thread: Thread)
    {
    }

    async getChecklist(narrative: string): Promise<Checklist<CheckpointProperties>>
    {
        this.thread.addBriefing(this.briefing.strategy, this.briefing.planning);
        this.thread.addScenario(narrative);
        return new Checklist(
            (await this.intelligence.getChecklist(this.thread)).checkpoints
                .map(checkpoint => new Checkpoint(checkpoint.name, checkpoint.properties))
        );
    }
}
