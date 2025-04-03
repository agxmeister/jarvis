import {Middleware, Context} from "../types";
import {inject} from "inversify";
import {dependencies} from "../../dependencies";
import Dumper from "../../Dumper";

export class Dump implements Middleware
{
    constructor(@inject(dependencies.Dumper) readonly dumper: Dumper)
    {
    }

    async run(context: Context): Promise<Context>
    {
        this.dumper.add(context.output);
        return context;
    }
}
