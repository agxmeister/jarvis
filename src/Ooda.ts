import {Orientation, Step} from "./types";
import Observation from "./Observation";
import Decision from "./Decision";

export default class Ooda
{
    constructor(
        public readonly observe: (context: any, step: Step) => Promise<Observation>,
        public readonly orient: (context: any, observation: Observation) => Promise<Orientation>,
        public readonly decide: (context: any, observation: Observation, orientation: Orientation) => Promise<Decision>,
        public readonly act: (context: any, decision: Decision) => Promise<void>,
    )
    {
    }

    async process(context: any, step: Step)
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
