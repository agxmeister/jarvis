import {Middleware} from "../../middleware";
import {ChatCompletionData} from "../types";
import {Context as MiddlewareContext} from "../../middleware";

export class KeepMessageHistory implements Middleware<ChatCompletionData, Record<string, any>>
{
    async handler(context: MiddlewareContext<ChatCompletionData, Record<string, any>>, next: () => Promise<void>): Promise<void>
    {
        context.payload.thread.addMessage(context.payload.chatCompletion.choices.at(0)!.message);
        await next();
    }
}
