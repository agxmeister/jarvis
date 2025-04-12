import {ChatCompletion, ChatCompletionCreateParamsBase} from "openai/src/resources/chat/completions";
import {Thread} from "./index";

export type ChatCompletionData = {
    thread: Thread,
    chatCompletionRequest: ChatCompletionCreateParamsBase,
    chatCompletion: ChatCompletion,
}
