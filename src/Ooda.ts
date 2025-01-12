import Narrator from "./Narrator";
import {Step} from "./types";

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

    async process(step: Step)
    {
        for (let j = 0; j < 5; j++) {
            const narrator = new Narrator();
            await this.observe(narrator, step);
            const message = await this.orient(narrator);
            if (message.completed) {
                return true;
            }
            const tools = await this.decide(narrator);
            await this.act(tools);
        }
        return false;
    }
}
