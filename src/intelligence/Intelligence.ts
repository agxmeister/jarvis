import {ZodSchema} from "zod";
import {inject, injectable, multiInject} from "inversify";
import {dependencies} from "../dependencies";
import OpenAI from "openai";
import {ChatCompletion, ChatCompletionMessage, ChatCompletionMessageParam} from "openai/src/resources/chat/completions";
import {Toolbox} from "../toolbox";
import {zodToJsonSchema} from "zod-to-json-schema";
import {Runtime} from "../tools/types";
import {Thread, Narration} from "./index";
import {ChatCompletionData} from "./types";
import {Middleware} from "../types";

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
        return await this.getMessageMiddleware(thread, narration, schema, toolbox, false);
    }

    async getActionsMessage(
        thread: Thread,
        narration: Narration,
        schema: ZodSchema,
        toolbox?: Toolbox<Runtime>,
    ): Promise<ChatCompletionMessage>
    {
        return await this.getMessageMiddleware(thread, narration, schema, toolbox, true);
    }

    private async getMessageMiddleware(
        thread: Thread,
        narration: Narration,
        schema: ZodSchema,
        toolbox?: Toolbox<Runtime>,
        applyTools?: boolean
    ): Promise<ChatCompletionMessage>
    {
        return (await this.middlewares.reduce(
            async (acc, middleware) =>
                middleware.process(await acc),
            Promise.resolve({
                thread: thread,
                output: await this.getChatCompletion(
                    [...thread.messages, ...narration.messages],
                    schema,
                    toolbox,
                    applyTools,
                ),
            } as ChatCompletionData),
        )).output.choices.at(0)!.message;
    }

    private async getChatCompletion(
        messages: ChatCompletionMessageParam[],
        schema: ZodSchema,
        toolbox?: Toolbox<Runtime>,
        applyTools?: boolean
    ): Promise<ChatCompletion>
    {
        return (await this.client.chat.completions.create({
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
        }));
    }
}
