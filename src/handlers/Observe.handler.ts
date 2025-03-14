import {ObserveParameters} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties} from "../types";
import {Runtime} from "../tools/types";
import {Observation} from "../ooda";
import readline = require("readline/promises");
import {Checkpoint} from "../checklist";

export const Observe = async ({
    context: {properties: {driver, breadcrumbs}},
    checkpoint,
}: ObserveParameters<ContextProperties, CheckpointProperties, Runtime>) => {
    return new Observation<ObservationProperties>({
        pageUrl: driver
            ? await driver.getCurrentUrl()
            : null,
        pageScreenshotUrl: process.env.OBSERVATION_MODE === "automatic"
            ? driver
                ? (await breadcrumbs.addScreenshot(await driver.takeScreenshot())).url
                : null
            : null,
        pageDescription: process.env.OBSERVATION_MODE === "automatic"
            ? null
            : await getScreenDescription(checkpoint),
    });
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
