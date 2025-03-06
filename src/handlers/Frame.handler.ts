import {FrameParameters} from "../ooda/types";
import {ContextProperties} from "../types";
import {Checkpoint} from "../ooda";

export const Frame = async ({
    context: {properties: {intelligence, briefing, thread}},
    scenario: {properties: narrative},
}: FrameParameters<ContextProperties, string>) => {
    thread.addBriefing(briefing.strategy, briefing.planning);
    thread.addScenario(narrative);
    return (await intelligence.getCheckpointsProperties(thread))
        .map(checkpointProperties => new Checkpoint(checkpointProperties.name, checkpointProperties));
};
