import {OrientParameters, Orientation} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties} from "../types";
import {Runtime} from "../tools/types";
import {getNarration} from "../utils";

export const Orient = async ({
    context: {intelligence, thread},
    toolbox,
    checkpoint,
    observation,
}: OrientParameters<ContextProperties, CheckpointProperties, ObservationProperties, Runtime>) => {
    const data: OrientationProperties = JSON.parse(
        await intelligence.think(thread, getNarration(checkpoint, observation.properties), toolbox)
    );
    return new Orientation(data.completed, data);
};
