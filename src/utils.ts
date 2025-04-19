import {Action, Briefing, CheckpointProperties, ObservationProperties, PageProperties} from "./types";
import {Checkpoint} from "./checklist";
import {getChecklistResponseSchema} from "./schemas";
import {z as zod} from "zod/lib";
import {ChatCompletionMessage} from "openai/src/resources/chat/completions";
import {ZodSchema} from "zod";
import {Intelligence, Thread, Narration} from "./intelligence";
import {Observation} from "./ooda";

export const getData = async (
    message: ChatCompletionMessage,
    schema: ZodSchema,
): Promise<zod.infer<typeof schema>> => JSON.parse(message.content!);

export const getActions = async (
    message: ChatCompletionMessage,
): Promise<Action[]> => message.tool_calls!.map(call => ({
    id: call.id,
    name: call.function.name,
    parameters: JSON.parse(call.function.arguments),
}));

export const getChecklist = async (
    narrative: string,
    briefing: Briefing,
    intelligence: Intelligence,
    thread: Thread
) =>
{
    thread.addBriefing(briefing.strategy, briefing.planning);
    thread.addScenario(narrative);
    return await getData(
        (await intelligence.getDataMessage(thread, new Narration(), getChecklistResponseSchema)),
        getChecklistResponseSchema,
    );
};

export const getNarration = (
    checkpoint: Checkpoint<CheckpointProperties>,
    page: PageProperties,
) =>
{
    const narration = new Narration();
    narration.addMessage({
        content: `Currently, you are on the step "${checkpoint.name}". At the end of this step you expect to get the following: ${checkpoint.properties.expectation}.`,
        role: "user",
        name: "Narrator",
    });

    if (page.url) {
        narration.addMessage({
            content: `Page with the URL "${page.url}" is opened in your browser.`,
            role: "user",
            name: "Narrator",
        });
    } else {
        narration.addMessage({
            content: `Your browser is closed.`,
            role: "user",
            name: "Narrator",
        });
    }

    if (page.screenshotUrl) {
        narration.addMessage({
            content: [
                {
                    text: `This is what you see on the browser's page.`,
                    type: "text",
                }, {
                    type: 'image_url',
                    image_url: {
                        url: page.screenshotUrl,
                    },
                }
            ],
            role: "user",
            name: "Narrator",
        });
    }

    if (page.description) {
        narration.addMessage({
            content: `This is a textual description of the browser's page content: ${page.description}.`,
            role: "user",
            name: "Narrator",
        });
    }

    return narration;
}
