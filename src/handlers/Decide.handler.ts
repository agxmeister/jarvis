import {DecideParameters, Decision} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties} from "../types";
import Narration from "../Narration";

export const Decide = async ({
    context: {properties: {intelligence, thread}},
    toolbox,
    checkpoint,
    observation,
}: DecideParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties>) => {
    return new Decision<DecisionProperties>({
        actions: await intelligence.act(thread, new Narration(checkpoint, observation.properties), toolbox),
    });
};
