import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";
import {Step} from "./types";

export default class Observation
{
    readonly messages: ChatCompletionMessageParam[] = [];

    addStep(step: Step)
    {
        this.messages.push({
            content: `Currently, you are on the step "${step.name}". At the end of this step you expect to get the following: ${step.expectation}.`,
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
