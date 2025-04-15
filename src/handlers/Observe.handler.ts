import {ObserveParameters} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties} from "../types";
import {Runtime} from "../tools/types";
import {Observation} from "../ooda";
import readline = require("readline/promises");
import {Checkpoint} from "../checklist";

export const Observe = async ({
    context: {browser, breadcrumbs},
    checkpoint,
}: ObserveParameters<ContextProperties, CheckpointProperties, Runtime>): Promise<Observation<ObservationProperties>> => {
    return {
        pageUrl: browser.isCurrentPage()
            ? await (await browser.getCurrentPage()).getCurrentUrl()
            : null,
        pageScreenshotUrl: process.env.OBSERVATION_MODE === "automatic"
            ? browser.isCurrentPage()
                ? (await breadcrumbs.addScreenshot(await (await browser.getCurrentPage()).takeScreenshot())).url
                : null
            : null,
        pageDescription: process.env.OBSERVATION_MODE === "automatic"
            ? null
            : await getScreenDescription(checkpoint),
    };
};

async function getScreenDescription(checkpoint: Checkpoint<CheckpointProperties>): Promise<string> {
    const request = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const answer = await request.question(`Current step is "${checkpoint.name}". What do you see? `);
    request.close();
    return answer;
}
