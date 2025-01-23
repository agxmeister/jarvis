import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";
import {StageProperties} from "./types";
import Stage from "./ooda/Stage";

export default class Narrator
{
    readonly messages: ChatCompletionMessageParam[] = [];

    addStep(stage: Stage<StageProperties>)
    {
        this.messages.push({
            content: `Currently, you are on the step "${stage.properties.name}". At the end of this step you expect to get the following: ${stage.properties.expectation}.`,
            role: "user",
            name: "Narrator",
        });
    }

    addAutomaticObservation(url: string, screenshot: string)
    {
        this.messages.push({
            content: url && screenshot ? [
                {
                    text: `You see "${url}" in the address bar of your browser.`,
                    type: "text",
                }, {
                    type: 'image_url',
                    image_url: {
                        url: screenshot,
                    },
                }
            ] : "Currently your browser is closed.",
            role: "user",
            name: "Narrator",
        });
    }

    addManualObservation(url: string, observation : string)
    {
        this.messages.push({
            content: observation + (url ? ` You see "${url}" in the address bar of your browser.` : ""),
            role: "user",
            name: "Narrator",
        });
    }
}
