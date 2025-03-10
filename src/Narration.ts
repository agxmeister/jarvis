import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";
import {CheckpointProperties, ObservationProperties} from "./types";
import {Checkpoint} from "./checklist";

export default class Narration
{
    readonly messages: ChatCompletionMessageParam[] = [];

    constructor(checkpoint: Checkpoint<CheckpointProperties>, observationProperties: ObservationProperties)
    {
        this.messages.push({
            content: `Currently, you are on the step "${checkpoint.name}". At the end of this step you expect to get the following: ${checkpoint.properties.expectation}.`,
            role: "user",
            name: "Narrator",
        });

        if (observationProperties.pageUrl) {
            this.messages.push({
                content: `Page with the URL "${observationProperties.pageUrl}" is opened in your browser.`,
                role: "user",
                name: "Narrator",
            });
        } else {
            this.messages.push({
                content: `Your browser is closed.`,
                role: "user",
                name: "Narrator",
            });
        }

        if (observationProperties.pageScreenshotUrl) {
            this.messages.push({
                content: [
                    {
                        text: `This is what you see on the browser's page.`,
                        type: "text",
                    }, {
                        type: 'image_url',
                        image_url: {
                            url: observationProperties.pageScreenshotUrl,
                        },
                    }
                ],
                role: "user",
                name: "Narrator",
            });
        }

        if (observationProperties.pageDescription) {
            this.messages.push({
                content: `This is a textual description of the browser's page content: ${observationProperties.pageDescription}.`,
                role: "user",
                name: "Narrator",
            });
        }
    }
}
