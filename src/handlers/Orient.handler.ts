import {OrientParameters, Orientation} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties} from "../types";
import {Runtime} from "../tools/types";
import {getData, getNarration} from "../utils";
import {orientSchema} from "../schemas";

export const Orient = async ({
    context: {intelligence, thread},
    toolbox,
    checkpoint,
    observation,
}: OrientParameters<ContextProperties, CheckpointProperties, ObservationProperties, Runtime>) => {
    const data: OrientationProperties = await getData(
        (await intelligence.getDataMessage(
            thread,
            getNarration(checkpoint, observation.properties),
            orientSchema,
            toolbox,
        )),
        orientSchema,
    );
    return new Orientation(data.completed, data);
};
