import {DecideParameters, Decision} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties} from "../types";
import {Runtime} from "../tools/types";
import {getNarration} from "../utils";
import {orientSchema} from "../schemas";

export const Decide = async ({
    context: {intelligence, thread},
    toolbox,
    checkpoint,
    observation,
}: DecideParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, Runtime>) => {
    return new Decision<DecisionProperties>({
        actions: await intelligence.act(
            thread,
            getNarration(checkpoint, observation.properties),
            toolbox,
            orientSchema,
        ),
    });
};
