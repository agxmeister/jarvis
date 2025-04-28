import {ZodSchema} from "zod";
import {inject, injectable, multiInject} from "inversify";
import {dependencies} from "../dependencies";
import OpenAI from "openai";
import {
    ChatCompletion,
    ChatCompletionCreateParamsBase,
    ChatCompletionMessage,
    ChatCompletionMessageParam
} from "openai/src/resources/chat/completions";
import {Toolbox} from "../toolbox";
import {zodToJsonSchema} from "zod-to-json-schema";
import {Runtime} from "../tools/types";
import {Thread, Narration} from "./index";
import {ChatCompletionData} from "./types";
import {Middleware} from "../middleware";
import {Context as MiddlewareContext, getMiddlewareRunner} from "../ooda/middleware";

@injectable()
export default class Intelligence
{
    constructor(
        @inject(dependencies.OpenAi) readonly client: OpenAI,
        @multiInject(dependencies.Middleware) readonly middlewares: Middleware<ChatCompletionData>[],
    )
    {
    }

    async getDataMessage(
        thread: Thread,
        narration: Narration,
        schema: ZodSchema,
        toolbox?: Toolbox<Runtime>,
    ): Promise<ChatCompletionMessage>
    {
        return await this.getChatCompletionMessage(thread, narration, schema, toolbox, false);
    }

    async getActionsMessage(
        thread: Thread,
        narration: Narration,
        schema: ZodSchema,
        toolbox?: Toolbox<Runtime>,
    ): Promise<ChatCompletionMessage>
    {
        return await this.getChatCompletionMessage(thread, narration, schema, toolbox, true);
    }

    private async getChatCompletionMessage(
        thread: Thread,
        narration: Narration,
        schema: ZodSchema,
        toolbox?: Toolbox<Runtime>,
        applyTools?: boolean,
    ): Promise<ChatCompletionMessage>
    {
        return (
            await this.getChatCompletionData(
                thread,
                this.getChatCompletionRequest(
                    [...thread.messages, ...narration.messages],
                    schema,
                    toolbox,
                    applyTools,
                ),
            )
        ).chatCompletion.choices.at(0)!.message;
    }

    private async getChatCompletionData(
        thread: Thread,
        chatCompletionRequest: ChatCompletionCreateParamsBase,
    ): Promise<ChatCompletionData>
    {
        const context: MiddlewareContext<Record<string, any>, ChatCompletionData> = {
            state: {
            },
            payload: {
                thread: thread,
                chatCompletionRequest: chatCompletionRequest,
                chatCompletion: (await this.client.chat.completions.create(chatCompletionRequest)) as ChatCompletion,
            },
        };
        await getMiddlewareRunner(
            this.middlewares.map(middleware => middleware.process.bind(middleware)),
            context,
        )();
        return context.payload;
    }

    private getChatCompletionRequest(
        messages: ChatCompletionMessageParam[],
        schema: ZodSchema,
        toolbox?: Toolbox<Runtime>,
        applyTools?: boolean
    ): ChatCompletionCreateParamsBase
    {
        return {
            model: "gpt-4o-mini",
            messages: messages,
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "response",
                    strict: true,
                    schema: zodToJsonSchema(schema),
                },
            },
            tools: !!toolbox ?
                toolbox.tools.map(tool => ({
                    type: "function",
                    function: {
                        name: tool.name,
                        description: tool.description,
                        parameters: zodToJsonSchema(tool.schema),
                    }
                })) : [],
            tool_choice: !!applyTools ? 'required' : 'none',
        };
    }
}
