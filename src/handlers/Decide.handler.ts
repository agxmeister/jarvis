import {DecideParameters, Decision} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties} from "../types";
import {Runtime} from "../tools/types";
import {getActions, getNarration} from "../utils";
import {followChecklistResponseSchema} from "../schemas";

export const Decide = async ({
    context: {intelligence, thread},
    toolbox,
    checkpoint,
    observation,
    orientation,
}: DecideParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, Runtime>): Promise<Decision<DecisionProperties>> => {
    return {
        actions: await getActions((await intelligence.getActionsMessage(
            thread,
            getNarration(checkpoint, observation.page),
            followChecklistResponseSchema,
            toolbox,
        ))),
    };
};
