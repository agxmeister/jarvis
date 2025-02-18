import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import OpenAI from "openai";
import Dumper from "./Dumper";
import {
    ChatCompletionCreateParamsNonStreaming,
    ChatCompletionMessageParam,
    ChatCompletionToolChoiceOption,
} from "openai/src/resources/chat/completions";
import {Action, CheckpointProperties, Toolbox} from "./types";
import Thread from "./Thread";
import Narration from "./Narration";
import {frameResponseSchema, orientResponseSchema} from "./schemas";

@injectable()
export default class Intelligence
{
    constructor(
        @inject(dependencies.OpenAi) readonly client: OpenAI,
        @inject(dependencies.Dumper) readonly dumper: Dumper,
    )
    {
    }

    async getCheckpointsProperties(thread: Thread): Promise<CheckpointProperties[]>
    {
        const completion = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: thread.messages,
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "response",
                    strict: true,
                    schema: frameResponseSchema,
                },
            },
        });
        this.dumper.add(completion);

        return JSON.parse(completion.choices.pop().message.content).steps;
    }

    async think(thread: Thread, narration: Narration, toolbox: Toolbox): Promise<string>
    {
        const completionRequest = {
            ...this.getCompletionRequest([...thread.messages, ...narration.messages], toolbox),
            tool_choice: 'none' as ChatCompletionToolChoiceOption,
        };
        const completion = await this.client.chat.completions.create(completionRequest);
        this.dumper.add(completion);

        const message = completion.choices.pop().message;
        thread.addRawMessage(message);

        return message.content;
    }

    async act(thread: Thread, narration: Narration, toolbox: Toolbox): Promise<Action[]>
    {
        const completionRequest = {
            ...this.getCompletionRequest([...thread.messages, ...narration.messages], toolbox),
            tool_choice: 'required' as ChatCompletionToolChoiceOption,
        };
        const completion = await this.client.chat.completions.create(completionRequest);
        this.dumper.add(completion);

        const message = completion.choices.pop().message;
        thread.addRawMessage(message);

        return message.tool_calls.map(call => ({
            id: call.id,
            name: call.function.name,
            parameters: JSON.parse(call.function.arguments),
        }));
    }

    private getCompletionRequest(messages: ChatCompletionMessageParam[], toolbox: Toolbox): ChatCompletionCreateParamsNonStreaming
    {
        return {
            model: "gpt-4o-mini",
            messages: messages,
            response_format: {
                type: "json_schema",
                json_schema: orientResponseSchema,
            },
            tools: toolbox.tools.map(tool => ({
                type: "function",
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.parameters,
                }
            })),
        };
    }
}
