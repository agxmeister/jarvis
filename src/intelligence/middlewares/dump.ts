import {Middleware} from "../../types";
import {ChatCompletionData} from "../types";
import {inject} from "inversify";
import {dependencies} from "../../dependencies";
import Dumper from "../../Dumper";

export class Dump implements Middleware<ChatCompletionData>
{
    constructor(@inject(dependencies.Dumper) readonly dumper: Dumper)
    {
    }

    async process(context: ChatCompletionData): Promise<ChatCompletionData>
    {
        this.dumper.add(context.chatCompletion);
        return context;
    }
}
