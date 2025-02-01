import {Context, Checkpoint, Observation, Orientation, Decision} from "./index";

export type ObserveParameters<ContextProperties, CheckpointProperties> = {
    context: Context<ContextProperties>,
    checkpoint: Checkpoint<CheckpointProperties>,
}

export type OrientParameters<ContextProperties, CheckpointProperties, ObservationProperties> = {
    context: Context<ContextProperties>,
    checkpoint: Checkpoint<CheckpointProperties>,
    observation: Observation<ObservationProperties>
}

export type DecideParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties> = {
    context: Context<ContextProperties>,
    checkpoint: Checkpoint<CheckpointProperties>,
    observation: Observation<ObservationProperties>
    orientation: Orientation<OrientationProperties>
}

export type ActParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties> = {
    context: Context<ContextProperties>,
    checkpoint: Checkpoint<CheckpointProperties>,
    observation: Observation<ObservationProperties>
    orientation: Orientation<OrientationProperties>
    decision: Decision<DecisionProperties>
}
