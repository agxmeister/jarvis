import {Middleware} from "../../ooda/middleware";
import {ChatCompletionData} from "../types";
import {inject} from "inversify";
import {dependencies} from "../../dependencies";
import {Logger} from "pino";
import {Context as MiddlewareContext} from "../../ooda/middleware";

export class LogChatCompletionMessage implements Middleware<MiddlewareContext<Record<string, any>, ChatCompletionData>, ChatCompletionData>
{
    constructor(@inject(dependencies.Logger) readonly logger: Logger) {
    }

    async process(context: MiddlewareContext<Record<string, any>, ChatCompletionData>, next: () => Promise<void>): Promise<void> {
        const message = context.payload.chatCompletion.choices.at(0)!.message;
        this.logger.debug({
            ...message,
            content: JSON.parse(message.content!),
            tool_calls: message.tool_calls?.reduce(
                (acc, call) => [...acc, {
                    ...call,
                    function: {
                        ...call.function,
                        arguments: JSON.parse(call.function.arguments),
                    }
                }],
                []
            ),
        });
        await next();
    }
}
