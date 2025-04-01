import {Middleware} from "../types";
import {ChatCompletionMessage} from "openai/src/resources/chat/completions";

export class Log implements Middleware
{
    run(message: ChatCompletionMessage, next: () => Promise<void>): Promise<void> {
        console.log(message);
        return next();
    }
}
