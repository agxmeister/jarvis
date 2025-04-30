import {Middleware} from "../../ooda/middleware";
import {ChatCompletionData} from "../types";
import {inject} from "inversify";
import {dependencies} from "../../dependencies";
import Dumper from "../../Dumper";
import {Context as MiddlewareContext} from "../../ooda/middleware";

export class DumpChatCompletion implements Middleware<MiddlewareContext<Record<string, any>, ChatCompletionData>, ChatCompletionData>
{
    constructor(@inject(dependencies.Dumper) readonly dumper: Dumper)
    {
    }

    async process(context: MiddlewareContext<Record<string, any>, ChatCompletionData>, next: () => Promise<void>): Promise<void>
    {
        this.dumper.add(context.payload.chatCompletion);
        await next();
    }
}
