import {Context, Checkpoint, Observation, Orientation, Decision} from "./index";

export type ObserveParameters<ContextProperties, CheckpointProperties> = {
    context: Context<ContextProperties>,
    checkpoint: Checkpoint<CheckpointProperties>,
}

export type OrientParameters<ContextProperties, ObservationProperties> = {
    context: Context<ContextProperties>,
    observation: Observation<ObservationProperties>
}

export type DecideParameters<ContextProperties, OrientationProperties> = {
    context: Context<ContextProperties>,
    orientation: Orientation<OrientationProperties>
}

export type ActParameters<ContextProperties, DecisionProperties> = {
    context: Context<ContextProperties>,
    decision: Decision<DecisionProperties>
}
