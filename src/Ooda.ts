import {OrientationProperties, StageProperties} from "./types";
import Context from "./Context";
import Observation from "./Observation";
import Decision from "./Decision";
import Stage from "./Stage";
import Orientation from "./Orientation";

export default class Ooda
{
    constructor(
        public readonly observe: (context: Context<any>, stage: Stage<any>) => Promise<Observation<any>>,
        public readonly orient: (context: Context<any>, observation: Observation<any>) => Promise<Orientation<any>>,
        public readonly decide: (context: Context<any>, observation: Observation<any>, orientation: Orientation<any>) => Promise<Decision>,
        public readonly act: (context: Context<any>, decision: Decision) => Promise<void>,
    )
    {
    }

    async process(context: Context<any>, stages: Stage<any>[]): Promise<void>
    {
        const result = await this.processScenario(context, stages);
        console.log(result ? "Scenario completed" : "Scenario failed");
    }

    private async processScenario(context: Context<any>, stages: Stage<any>[]): Promise<boolean>
    {
        for (const stage of stages) {
            const completed = await this.processStep(context, stage);
            if (!completed) {
                return false;
            }
        }
        return true;
    }

    private async processStep(context: Context<any>, stage: Stage<any>): Promise<boolean>
    {
        for (let j = 0; j < 5; j++) {
            const observation = await this.observe(context, stage);
            const orientation = await this.orient(context, observation);
            if (orientation.properties.completed) {
                return true;
            }
            const decision = await this.decide(context, observation, orientation);
            await this.act(context, decision);
        }
        return false;
    }
}
