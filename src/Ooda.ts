import {Step} from "./types";
import Thread from "./Thread";

export default class Ooda
{
    constructor(
        public readonly observe: Function,
        public readonly orient: Function,
        public readonly decide: Function,
        public readonly act: Function,
    )
    {
    }

    async process(thread: Thread, step: Step)
    {
        for (let j = 0; j < 5; j++) {
            const observation = await this.observe(step);
            const orientation = await this.orient(thread, observation);
            if (orientation.completed) {
                return true;
            }
            const decision = await this.decide(thread, observation);
            await this.act(thread, decision.actions);
        }
        return false;
    }
}
