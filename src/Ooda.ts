import {Orientation, Step} from "./types";
import Context from "./Context";
import Observation from "./Observation";
import Decision from "./Decision";

export default class Ooda
{
    constructor(
        public readonly observe: (context: Context<any>, step: Step) => Promise<Observation<any>>,
        public readonly orient: (context: Context<any>, observation: Observation<any>) => Promise<Orientation>,
        public readonly decide: (context: Context<any>, observation: Observation<any>, orientation: Orientation) => Promise<Decision>,
        public readonly act: (context: Context<any>, decision: Decision) => Promise<void>,
    )
    {
    }

    async process(context: Context<any>, steps: Step[]): Promise<void>
    {
        const result = await this.processScenario(context, steps);
        console.log(result ? "Scenario completed" : "Scenario failed");
    }

    private async processScenario(context: Context<any>, steps: Step[]): Promise<boolean>
    {
        for (const step of steps) {
            const completed = await this.processStep(context, step);
            if (!completed) {
                return false;
            }
        }
        return true;
    }

    private async processStep(context: Context<any>, step: Step): Promise<boolean>
    {
        for (let j = 0; j < 5; j++) {
            const observation = await this.observe(context, step);
            const orientation = await this.orient(context, observation);
            if (orientation.completed) {
                return true;
            }
            const decision = await this.decide(context, observation, orientation);
            await this.act(context, decision);
        }
        return false;
    }
}
