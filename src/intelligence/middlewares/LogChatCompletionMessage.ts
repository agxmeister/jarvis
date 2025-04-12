import {Middleware} from "../../middleware";
import {ChatCompletionData} from "../types";
import {inject} from "inversify";
import {dependencies} from "../../dependencies";
import {Logger} from "pino";

export class LogChatCompletionMessage implements Middleware<ChatCompletionData>
{
    constructor(@inject(dependencies.Logger) readonly logger: Logger) {
    }

    async process(context: ChatCompletionData): Promise<ChatCompletionData> {
        const message = context.chatCompletion.choices.at(0)!.message;
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
        return context;
    }
}
