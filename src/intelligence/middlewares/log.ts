import {Middleware} from "../types";
import {ChatCompletionMessage} from "openai/src/resources/chat/completions";

export class Log implements Middleware
{
    async run(message: ChatCompletionMessage): Promise<ChatCompletionMessage> {
        console.log(message);
        return message;
    }
}
