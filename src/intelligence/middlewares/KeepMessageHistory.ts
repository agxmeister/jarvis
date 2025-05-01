import {Middleware} from "../../middleware";
import {ChatCompletionData} from "../types";
import {Context as MiddlewareContext} from "../../middleware";

export class KeepMessageHistory implements Middleware<MiddlewareContext<Record<string, any>, ChatCompletionData>, ChatCompletionData>
{
    async handler(context: MiddlewareContext<Record<string, any>, ChatCompletionData>, next: () => Promise<void>): Promise<void>
    {
        context.payload.thread.addMessage(context.payload.chatCompletion.choices.at(0)!.message);
        await next();
    }
}
