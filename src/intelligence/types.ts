import {ChatCompletion,} from "openai/src/resources/chat/completions";
import {Thread} from "./index";

export type ChatCompletionData = {
    thread: Thread,
    output: ChatCompletion,
}
