import {z as zod, ZodSchema} from "zod";
import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import OpenAI from "openai";
import Dumper from "./Dumper";
import {
    ChatCompletionCreateParamsNonStreaming,
    ChatCompletionMessageParam,
    ChatCompletionToolChoiceOption,
} from "openai/src/resources/chat/completions";
import {Action} from "./types";
import Thread from "./Thread";
import Narration from "./Narration";
import {Toolbox} from "./toolbox";
import {zodToJsonSchema} from "zod-to-json-schema";
import {Runtime} from "./tools/types";

@injectable()
export default class Intelligence
{
    constructor(
        @inject(dependencies.OpenAi) readonly client: OpenAI,
        @inject(dependencies.Dumper) readonly dumper: Dumper,
    )
    {
    }

    async process(thread: Thread, schema: ZodSchema): Promise<zod.infer<typeof schema>>
    {
        const completion = await this.client.chat.completions.create(
            this.getCompletionRequest(thread.messages, schema)
        );

        this.dumper.add(completion);

        return JSON.parse(completion.choices.pop()!.message.content!);
    }

    async think(thread: Thread, narration: Narration, toolbox: Toolbox<Runtime>, schema: ZodSchema): Promise<zod.infer<typeof schema>>
    {
        const completionRequest = {
            ...this.getCompletionRequest([...thread.messages, ...narration.messages], schema, toolbox),
            tool_choice: 'none' as ChatCompletionToolChoiceOption,
        };
        const completion = await this.client.chat.completions.create(completionRequest);
        this.dumper.add(completion);

        const message = completion.choices.pop()!.message;
        thread.addMessage(message);

        return JSON.parse(message.content!);
    }

    async act(thread: Thread, narration: Narration, toolbox: Toolbox<Runtime>, schema: ZodSchema): Promise<Action[]>
    {
        const completionRequest = {
            ...this.getCompletionRequest([...thread.messages, ...narration.messages], schema, toolbox),
            tool_choice: 'required' as ChatCompletionToolChoiceOption,
        };
        const completion = await this.client.chat.completions.create(completionRequest);
        this.dumper.add(completion);

        const message = completion.choices.pop()!.message;
        thread.addMessage(message);

        return message.tool_calls!.map(call => ({
            id: call.id,
            name: call.function.name,
            parameters: JSON.parse(call.function.arguments),
        }));
    }

    private getCompletionRequest(messages: ChatCompletionMessageParam[], schema: ZodSchema, toolbox?: Toolbox<Runtime>): ChatCompletionCreateParamsNonStreaming
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
            tools: toolbox ?
                toolbox.tools.map(tool => ({
                    type: "function",
                    function: {
                        name: tool.name,
                        description: tool.description,
                        parameters: zodToJsonSchema(tool.schema),
                    }
                })) : [],
        };
    }
}
