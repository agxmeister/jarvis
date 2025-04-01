import {Middleware} from "../types";
import {ChatCompletionMessage} from "openai/src/resources/chat/completions";
import {inject} from "inversify";
import {dependencies} from "../../dependencies";
import Dumper from "../../Dumper";

export class Dump implements Middleware
{
    constructor(@inject(dependencies.Dumper) readonly dumper: Dumper)
    {
    }

    async run(message: ChatCompletionMessage, next: () => Promise<void>): Promise<void>
    {
        this.dumper.add(message);
        await next();
    }
}
