import Context from "./Context";
import Observation from "./Observation";
import Decision from "./Decision";
import Checkpoint from "./Checkpoint";
import Orientation from "./Orientation";
import {ObserveParameters} from "./types";

export default class Ooda
{
    constructor(
        public readonly observe: (parameters: ObserveParameters<any, any>) => Promise<Observation<any>>,
        public readonly orient: (context: Context<any>, observation: Observation<any>) => Promise<Orientation<any>>,
        public readonly decide: (context: Context<any>, orientation: Orientation<any>) => Promise<Decision<any>>,
        public readonly act: (context: Context<any>, decision: Decision<any>) => Promise<void>,
    )
    {
    }

    async process(context: Context<any>, checkpoints: Checkpoint<any>[]): Promise<void>
    {
        const result = await this.processScenario(context, checkpoints);
        console.log(result ? "Scenario completed" : "Scenario failed");
    }

    private async processScenario(context: Context<any>, checkpoints: Checkpoint<any>[]): Promise<boolean>
    {
        for (const checkpoint of checkpoints) {
            const completed = await this.processStep(context, checkpoint);
            if (!completed) {
                return false;
            }
        }
        return true;
    }

    private async processStep(context: Context<any>, checkpoint: Checkpoint<any>): Promise<boolean>
    {
        for (let j = 0; j < 5; j++) {
            const observation = await this.observe({
                context: context,
                checkpoint: checkpoint,
            });
            const orientation = await this.orient(context, observation);
            if (orientation.progression) {
                return true;
            }
            const decision = await this.decide(context, orientation);
            await this.act(context, decision);
        }
        return false;
    }
}
