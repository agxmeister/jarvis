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
                    schema: {
                        type: "object",
                        properties: {
                            steps: {
                                type: "array",
                                items: {
                                    type: "object",
                                    description: "The list of steps to perform to complete the scenario",
                                    properties: {
                                        name: {
                                            description: "Unique and concise name of the step, self-explaining its essence.",
                                            type: "string",
                                        },
                                        action: {
                                            description: "Explanation of what exactly must be done to complete this step and proceed to the next step.",
                                            type: "string",
                                        },
                                        expectation: {
                                            description: "Expectation of what exactly should happen after completion of this step.",
                                            type: "string",
                                        },
                                    },
                                    required: ["name", "action", "expectation"],
                                    additionalProperties: false,
                                },
                            },
                        },
                        required: ["steps"],
                        additionalProperties: false,
                    },
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
                json_schema: {
                    name: "response",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            observation: {
                                description: "Your interpretation of the current application's state.",
                                type: "string",
                            },
                            completed: {
                                description: "Status of the current step. True, if you consider it passed.",
                                type: "boolean",
                            },
                            comment: {
                                description: "Describe in your own word, do you consider the current step passed or not.",
                                type: "string",
                            },
                        },
                        required: ["observation", "completed", "comment"],
                        additionalProperties: false,
                    },
                },
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
