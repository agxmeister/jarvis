import {Middleware} from "../../types";
import {ChatCompletionData} from "../types";

export class KeepMessageHistory implements Middleware<ChatCompletionData>
{
    async process(context: ChatCompletionData): Promise<ChatCompletionData>
    {
        context.thread.addMessage(context.chatCompletion.choices.at(0)!.message);
        return context;
    }
}
