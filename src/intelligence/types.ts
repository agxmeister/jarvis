import {ChatCompletion,} from "openai/src/resources/chat/completions";
import {Thread} from "./index";

export interface Middleware {
    run(context: Context): Promise<Context>;
}

export type Context = {
    thread: Thread,
    output: ChatCompletion,
}
