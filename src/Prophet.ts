import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import OpenAI from "openai";

@injectable()
export default class Prophet
{
    constructor(@inject(dependencies.OpenAi) readonly client: OpenAI)
    {
    }

    async describeScreenshot(screenshotUrl: string)
    {
        const completion = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{
                role: "user",
                content: [
                    {
                        text: "Could you please tell what you see on this screenshot, and after that click on coordinates 200, 200?",
                        type: "text",
                    }, {
                        type: 'image_url',
                        image_url: {
                            url: screenshotUrl,
                        },
                    },
                ],
            }],
            tools: [{
                type: "function",
                function: {
                    name: "Click",
                    description: "Click on the screen",
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
            }],
        });
        console.log(completion.choices.pop());
    }
}
