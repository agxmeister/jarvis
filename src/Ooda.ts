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
            const narrator = await this.observe(step);
            const message = await this.orient(thread, narrator);
            if (message.completed) {
                return true;
            }
            const tools = await this.decide(thread, narrator);
            await this.act(thread, tools);
        }
        return false;
    }
}
