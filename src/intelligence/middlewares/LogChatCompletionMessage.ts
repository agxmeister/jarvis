import {Middleware} from "../../middleware";
import {ChatCompletionData} from "../types";
import {inject} from "inversify";
import {dependencies} from "../../dependencies";
import {Logger} from "pino";
import {Context as MiddlewareContext} from "../../middleware";

export class LogChatCompletionMessage implements Middleware<ChatCompletionData, Record<string, any>>
{
    constructor(@inject(dependencies.Logger) readonly logger: Logger) {
    }

    async handler(context: MiddlewareContext<ChatCompletionData, Record<string, any>>, next: () => Promise<void>): Promise<void> {
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
