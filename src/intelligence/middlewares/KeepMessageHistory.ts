import {Middleware} from "../../ooda/middleware";
import {ChatCompletionData} from "../types";
import {Context as MiddlewareContext} from "../../ooda/middleware";

export class KeepMessageHistory implements Middleware<MiddlewareContext<Record<string, any>, ChatCompletionData>, ChatCompletionData>
{
    async process(context: MiddlewareContext<Record<string, any>, ChatCompletionData>, next: () => Promise<void>): Promise<void>
    {
        context.payload.thread.addMessage(context.payload.chatCompletion.choices.at(0)!.message);
        await next();
    }
}
