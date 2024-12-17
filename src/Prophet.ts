import OpenAI from "openai";

export default class Prophet
{
    readonly client: OpenAI;

    constructor(client: OpenAI)
    {
        this.client = client;
    }

    async describeScreenshot(screenshotUrl: string)
    {
        const completion = await this.client.chat.completions.create({
            messages: [{
                role: "user",
                content: [
                    {
                        text: "Could you please what you see on this screenshot?",
                        type: "text",
                    }, {
                        type: 'image_url',
                        image_url: {
                            url: screenshotUrl,
                        },
                    },
                ],
            }],
            model: "gpt-4o-mini",
        });

        console.log(completion.choices.pop().message);
    }
}
