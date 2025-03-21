import {Briefing, CheckpointProperties, ObservationProperties} from "./types";
import Intelligence from "./Intelligence";
import Thread from "./Thread";
import {Checkpoint} from "./checklist";
import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";
import Narration from "./Narration";

export const getChecklist = async (
    narrative: string,
    briefing: Briefing,
    intelligence: Intelligence,
    thread: Thread
) =>
{
    thread.addBriefing(briefing.strategy, briefing.planning);
    thread.addScenario(narrative);
    return await intelligence.getChecklist(thread);
};

export const getNarration = (
    checkpoint: Checkpoint<CheckpointProperties>,
    observationProperties: ObservationProperties
) =>
{
    const messages: ChatCompletionMessageParam[] = [];
    messages.push({
        content: `Currently, you are on the step "${checkpoint.name}". At the end of this step you expect to get the following: ${checkpoint.properties.expectation}.`,
        role: "user",
        name: "Narrator",
    });

    if (observationProperties.pageUrl) {
        messages.push({
            content: `Page with the URL "${observationProperties.pageUrl}" is opened in your browser.`,
            role: "user",
            name: "Narrator",
        });
    } else {
        messages.push({
            content: `Your browser is closed.`,
            role: "user",
            name: "Narrator",
        });
    }

    if (observationProperties.pageScreenshotUrl) {
        messages.push({
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
        messages.push({
            content: `This is a textual description of the browser's page content: ${observationProperties.pageDescription}.`,
            role: "user",
            name: "Narrator",
        });
    }

    return new Narration(messages);
}
