import {OodaParameters} from "./types";
import {Context, Scenario, Checkpoint} from "./index";

export default class Ooda
{
    constructor(readonly handlers: OodaParameters)
    {
    }

    async process(context: Context<any>, scenario: Scenario<any>): Promise<boolean>
    {
        const checkpoints = await this.handlers.frame({
            context: context,
            scenario: scenario,
        });
        for (const checkpoint of checkpoints) {
            const completed = await this.processCheckpoint(context, checkpoint);
            if (!completed) {
                return false;
            }
        }
        return true;
    }

    private async processCheckpoint(context: Context<any>, checkpoint: Checkpoint<any>): Promise<boolean>
    {
        for (let j = 0; j < 5; j++) {
            const observation = await this.handlers.observe({
                context: context,
                checkpoint: checkpoint,
            });
            const orientation = await this.handlers.orient({
                context: context,
                checkpoint: checkpoint,
                observation: observation,
            });
            if (orientation.progression) {
                return true;
            }
            const decision = await this.handlers.decide({
                context: context,
                checkpoint: checkpoint,
                observation: observation,
                orientation: orientation,
            });
            await this.handlers.act({
                context: context,
                checkpoint: checkpoint,
                observation: observation,
                orientation: orientation,
                decision: decision,
            });
        }
        return false;
    }
}
