import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import OpenAI from "openai";
import {ChatCompletionMessage} from "openai/resources/chat/completions";
import Dumper from "./Dumper";

@injectable()
export default class Prophet
{
    constructor(
        @inject(dependencies.OpenAi) readonly client: OpenAI,
        @inject(dependencies.Dumper) readonly dumper: Dumper,
    )
    {
    }

    async appeal(instruction: string, steps: string[] = [], screenshotUrl: string|null = null): Promise<ChatCompletionMessage>
    {
        const messages = [];

        messages.push({
            role: "system",
            name: "Boss",
            content: instruction,
        });

        messages.push({
            role: "system",
            name: "Narrator",
            content: screenshotUrl
                ? [
                    {
                        text: "This is what you see on the browser's screen now.",
                        type: "text",
                    }, {
                        type: 'image_url',
                        image_url: {
                            url: screenshotUrl,
                        },
                    }
                ]
                : "Browser's screen is closed now.",
        });

        const completion = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
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
                                description: "URL to open",
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

        return completion.choices.pop().message;
    }
}
