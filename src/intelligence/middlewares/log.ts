import {Middleware} from "../../types";
import {ChatCompletionData} from "../types";
import {inject} from "inversify";
import {dependencies} from "../../dependencies";
import {Logger} from "pino";

export class Log implements Middleware<ChatCompletionData>
{
    constructor(@inject(dependencies.Logger) readonly logger: Logger) {
    }

    async process(context: ChatCompletionData): Promise<ChatCompletionData> {
        this.logger.debug(context);
        return context;
    }
}
