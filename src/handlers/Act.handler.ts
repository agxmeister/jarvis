import {ActParameters} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties} from "../types";
import {Runtime} from "../tools/types";

export const Act = async ({
    context,
    toolbox,
    decision: {properties: {actions}},
}: ActParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties, Runtime>) => {
    for (const action of actions) {
        await toolbox.apply(
            action.name,
            action.parameters,
            {
                action: action.id,
                context: context,
            }
        );
    }
};
