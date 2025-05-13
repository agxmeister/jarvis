import {DecideParameters, Decision} from "../ooda";
import {ContextProperties, CheckpointProperties, OrientationProperties, DecisionProperties} from "../types";
import {Runtime} from "../tools/types";
import {getActions, getNarration} from "../utils";
import {followChecklistResponseSchema} from "../schemas";

export const Decide = async ({
    context: {intelligence, thread},
    toolbox,
    checkpoint,
    orientation,
}: DecideParameters<ContextProperties, CheckpointProperties, OrientationProperties, Runtime>): Promise<Decision<DecisionProperties>> => {
    return {
        actions: await getActions((await intelligence.getActionsMessage(
            thread,
            getNarration(checkpoint, orientation.page),
            followChecklistResponseSchema,
            toolbox,
        ))),
    };
};
