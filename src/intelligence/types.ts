import {ChatCompletionMessage} from "openai/src/resources/chat/completions";

export interface Middleware {
    run(message: ChatCompletionMessage): void;
}
