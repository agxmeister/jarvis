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

    run(message: ChatCompletionMessage): void
    {
        this.dumper.add(message);
    }
}
