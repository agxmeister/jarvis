import {Middleware, Context} from "../types";

export class Log implements Middleware
{
    async run(context: Context): Promise<Context> {
        console.log(context);
        return context;
    }
}
