import {ActParameters} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties} from "../types";
import {Runtime} from "../tools/types";
import {apply} from "../toolbox";

export const Act = async ({
    context,
    toolbox,
    decision: {actions},
}: ActParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties, Runtime>) => {
    for (const action of actions) {
        await apply(toolbox, action.name, action.parameters, {
            action: action.id,
            context: context,
        });
    }
};
