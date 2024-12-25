import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import OpenAI from "openai";
import Dumper from "./Dumper";
import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";
import {Tool} from "./types";

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

    addNarratorMessage(screenshot: string|null = null)
    {
        this.messages.push({
            role: "user",
            name: "Narrator",
            content: screenshot
                ? [
                    {
                        text: "This is what you see on the browser's screen now.",
                        type: "text",
                    }, {
                        type: 'image_url',
                        image_url: {
                            url: screenshot,
                        },
                    }
                ]
                : "Browser's screen is closed now.",
        });
    }

    async think(): Promise<string>
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
                            status: {
                                description: "Current state of scenario.",
                                enum: ["progress", "succeed", "failed"]
                            },
                            comment: {
                                description: "Comment to the current state of scenario. ",
                                type: "string",
                            }
                        },
                        required: ["status", "comment"],
                        additionalProperties: false,
                    },
                },
            },
        });

        this.dumper.add(completion);

        return completion.choices.pop().message.content;
    }

    async act(): Promise<Tool[]>
    {
        const completion = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: this.messages,
            tool_choice: "required",
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
            }],
        });

        this.dumper.add(completion);

        return completion.choices.pop().message.tool_calls.map(call => ({
            name: call.function.name,
            parameters: JSON.parse(call.function.arguments),
        }));
    }
}
