import {Middleware} from "../../types";
import {ChatCompletionData} from "../types";

export class Log implements Middleware<ChatCompletionData>
{
    async process(context: ChatCompletionData): Promise<ChatCompletionData> {
        console.log(context);
        return context;
    }
}
