import {ActParameters} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties} from "../types";

export const Act = async ({
    context,
    toolbox,
    decision: {properties: {actions}},
}: ActParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties>) => {
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
