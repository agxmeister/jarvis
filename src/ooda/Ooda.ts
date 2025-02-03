import {FrameParameters, DecideParameters, ObserveParameters, OrientParameters, ActParameters} from "./types";
import {Context, Scenario, Checkpoint, Decision, Observation, Orientation} from "./index";

export default class Ooda
{
    constructor(
        readonly frame: (parameters: FrameParameters<any, any>) => Promise<Checkpoint<any>[]>,
        readonly observe: (parameters: ObserveParameters<any, any>) => Promise<Observation<any>>,
        readonly orient: (parameters: OrientParameters<any, any, any>) => Promise<Orientation<any>>,
        readonly decide: (parameters: DecideParameters<any, any, any, any>) => Promise<Decision<any>>,
        readonly act: (parameters: ActParameters<any, any, any, any, any>) => Promise<void>,
    )
    {
    }

    async process(context: Context<any>, scenario: Scenario<any>): Promise<boolean>
    {
        const checkpoints = await this.frame({
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
            const observation = await this.observe({
                context: context,
                checkpoint: checkpoint,
            });
            const orientation = await this.orient({
                context: context,
                checkpoint: checkpoint,
                observation: observation,
            });
            if (orientation.progression) {
                return true;
            }
            const decision = await this.decide({
                context: context,
                checkpoint: checkpoint,
                observation: observation,
                orientation: orientation,
            });
            await this.act({
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
