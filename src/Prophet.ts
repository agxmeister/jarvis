import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import OpenAI from "openai";
import Dumper from "./Dumper";
import {
    ChatCompletionCreateParamsNonStreaming,
    ChatCompletionMessageParam
} from "openai/src/resources/chat/completions";
import {Step, Tool} from "./types";

@injectable()
export default class Prophet
{
    private messages: ChatCompletionMessageParam[];

    constructor(
        @inject(dependencies.OpenAi) readonly client: OpenAI,
        @inject(dependencies.Dumper) readonly dumper: Dumper,
    )
    {
        this.messages = [];
    }

    addDungeonMasterMessage(message:string)
    {
        this.messages.push({
            role: "system",
            content: message,
        });
    }

    addMessengerMessage(message: string)
    {
        this.messages.push({
            role: "user",
            name: "Messenger",
            content: message,
        });
    }

    addAssistantMessage(message: string)
    {
        this.messages.push({
            role: "assistant",
            content: message,
        });
    }

    addNarratorMessage(currentUrl: string = null, screenshotUrl: string = null)
    {
        this.messages.push({
            role: "user",
            name: "Narrator",
            content: currentUrl && screenshotUrl ? [
                {
                    text: `Currently, you see "${currentUrl}" in the address bar of your browser. This is what you see on the browser's screen.`,
                    type: "text",
                }, {
                    type: 'image_url',
                    image_url: {
                        url: screenshotUrl,
                    },
                }
            ] : "Currently your browser is closed",
        });
    }

    async getSteps(): Promise<Step[]>
    {
        const completion = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: this.messages,
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

    async think(steps: string[]): Promise<string>
    {
        const completion = await this.client.chat.completions.create(this.getCompletionRequest(this.messages, false, steps));
        this.dumper.add(completion);

        return completion.choices.pop().message.content;
    }

    async act(steps: string[]): Promise<Tool[]>
    {
        const completion = await this.client.chat.completions.create(this.getCompletionRequest(this.messages, true, steps));
        this.dumper.add(completion);

        return completion.choices.pop().message.tool_calls.map(call => ({
            name: call.function.name,
            parameters: JSON.parse(call.function.arguments),
        }));
    }

    private getCompletionRequest(messages: ChatCompletionMessageParam[], act: boolean, steps: string[]): ChatCompletionCreateParamsNonStreaming
    {
        const stepProperties = steps.reduce((acc: any, step) => ({...acc, [step]: {
            type: "string",
            enum: ["planned", "failed", "completed"],
            description: `Status of the step ${step}.`,
        }}), {});

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
                            comment: {
                                description: "Describe what you see and think you should do to complete the current step of the scenario and proceed to the next step.",
                                type: "string",
                            },
                            steps: {
                                type: "object",
                                description: "List of steps and their statuses. Status must be one of the following: 'planned' means you didn't proceed to this step yet; 'failed' means you already did the action to complete it, but, according to your observation, it didn't help; 'passed' means, according to your observation, the step was already done.",
                                properties: stepProperties,
                                required: steps,
                                additionalProperties: false,
                            },
                        },
                        required: ["comment", "steps"],
                        additionalProperties: false,
                    },
                },
            },
            tool_choice: act ? "required" : "none",
            tools: [{
                type: "function",
                function: {
                    name: "click",
                    description: "On the current browser's screen move the mouse pointer to specified coordinates and click.",
                    parameters: {
                        type: "object",
                        properties: {
                            x: {
                                type: "integer",
                                description: "The X coordinate to click",
                            },
                            y: {
                                type: "integer",
                                description: "The Y coordinate to click",
                            },
                        },
                        required: ["x", "y"],
                    },
                },
            }, {
                type: "function",
                function: {
                    name: "open",
                    description: "Open the given URL on browser's screen.",
                    parameters: {
                        type: "object",
                        properties: {
                            url: {
                                type: "string",
                                description: "URL to open in browser.",
                            },
                        },
                        required: ["url"],
                    },
                },
            }, {
                type: "function",
                function: {
                    name: "close",
                    description: "Close the browser's screen.",
                },
            }, {
                type: "function",
                function: {
                    name: "wait",
                    description: "No nothing.",
                },
            }],
        };
    }
}
