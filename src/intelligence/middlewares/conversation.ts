import {Middleware, Context} from "../types";

export class Conversation implements Middleware
{
    async run(context: Context): Promise<Context>
    {
        context.thread.addMessage(context.output.choices.at(0)!.message);
        return context;
    }
}
