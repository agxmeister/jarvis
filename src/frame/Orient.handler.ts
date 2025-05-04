import {OrientParameters, Orientation} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties} from "../types";
import {Runtime} from "../tools/types";
import {getData, getNarration} from "../utils";
import {followChecklistResponseSchema} from "../schemas";

export const Orient = async ({
    context: {intelligence, thread},
    toolbox,
    checkpoint,
    observation,
}: OrientParameters<ContextProperties, CheckpointProperties, ObservationProperties, Runtime>): Promise<Orientation<OrientationProperties>> => {
    return await getData(
        (await intelligence.getDataMessage(
            thread,
            getNarration(checkpoint, observation.page),
            followChecklistResponseSchema,
            toolbox,
        )),
        followChecklistResponseSchema,
    );
};
