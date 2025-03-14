import {OrientParameters, Orientation} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties} from "../types";
import {Runtime} from "../tools/types";
import Narration from "../Narration";

export const Orient = async ({
    context: {properties: {intelligence, thread}},
    toolbox,
    checkpoint,
    observation,
}: OrientParameters<ContextProperties, CheckpointProperties, ObservationProperties, Runtime>) => {
    const data: OrientationProperties = JSON.parse(
        await intelligence.think(thread, new Narration(checkpoint, observation.properties), toolbox)
    );
    return new Orientation(data.completed, data);
};
