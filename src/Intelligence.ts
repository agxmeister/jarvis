import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import OpenAI from "openai";
import Dumper from "./Dumper";
import {
    ChatCompletionCreateParamsNonStreaming,
    ChatCompletionMessageParam,
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
        const completion = await this.client.chat.completions.create(this.getCompletionRequest([...thread.messages, ...narration.messages], toolbox, false));
        this.dumper.add(completion);

        const message = completion.choices.pop().message;
        thread.addRawMessage(message);

        return message.content;
    }

    async act(thread: Thread, narration: Narration, toolbox: Toolbox): Promise<Action[]>
    {
        const completion = await this.client.chat.completions.create(this.getCompletionRequest([...thread.messages, ...narration.messages], toolbox, true));
        this.dumper.add(completion);

        const message = completion.choices.pop().message;
        thread.addRawMessage(message);

        return message.tool_calls.map(call => ({
            id: call.id,
            name: call.function.name,
            parameters: JSON.parse(call.function.arguments),
        }));
    }

    private getCompletionRequest(messages: ChatCompletionMessageParam[], toolbox: Toolbox, act: boolean): ChatCompletionCreateParamsNonStreaming
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
            tool_choice: act ? "required" : "none",
            tools: [{
                type: "function",
                function: {
                    name: "click",
                    description: toolbox.tools.click.description,
                    parameters: toolbox.tools.click.parameters,
                },
            }, {
                type: "function",
                function: {
                    name: "open",
                    description: toolbox.tools.open.description,
                    parameters: toolbox.tools.open.parameters,
                },
            }, {
                type: "function",
                function: {
                    name: "close",
                    description: toolbox.tools.close.description,
                    parameters: toolbox.tools.close.parameters,
                },
            }, {
                type: "function",
                function: {
                    name: "wait",
                    description: toolbox.tools.wait.description,
                    parameters: toolbox.tools.wait.parameters,
                },
            }],
        };
    }
}
