import {ZodSchema} from "zod";
import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import OpenAI from "openai";
import Dumper from "./Dumper";
import {
    ChatCompletionCreateParamsNonStreaming, ChatCompletionMessage,
    ChatCompletionMessageParam,
    ChatCompletionToolChoiceOption,
} from "openai/src/resources/chat/completions";
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

    async process(thread: Thread, narration: Narration, schema: ZodSchema, toolbox?: Toolbox<Runtime>, act?: boolean): Promise<ChatCompletionMessage>
    {
        const completionRequest = {
            ...this.getCompletionRequest([...thread.messages, ...narration.messages], schema, toolbox),
            tool_choice: !!act ? 'required' : 'none' as ChatCompletionToolChoiceOption,
        };
        const completion = await this.client.chat.completions.create(completionRequest);
        this.dumper.add(completion);

        const message = completion.choices.pop()!.message;

        thread.addMessage(message);

        return message;
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
