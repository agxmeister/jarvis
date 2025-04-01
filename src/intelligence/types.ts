import {ChatCompletionMessage} from "openai/src/resources/chat/completions";

export interface Middleware {
    run(message: ChatCompletionMessage, next: () => Promise<void>): Promise<void>;
}
