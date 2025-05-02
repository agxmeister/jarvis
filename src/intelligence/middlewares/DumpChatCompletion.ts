import {Middleware} from "../../middleware";
import {ChatCompletionData} from "../types";
import {inject} from "inversify";
import {dependencies} from "../../dependencies";
import Dumper from "../../Dumper";
import {Context as MiddlewareContext} from "../../middleware";

export class DumpChatCompletion implements Middleware<ChatCompletionData, Record<string, any>>
{
    constructor(@inject(dependencies.Dumper) readonly dumper: Dumper)
    {
    }

    async handler(context: MiddlewareContext<ChatCompletionData, Record<string, any>>, next: () => Promise<void>): Promise<void>
    {
        this.dumper.add(context.payload.chatCompletion);
        await next();
    }
}
