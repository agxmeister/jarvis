import {Context, Checkpoint, Observation, Orientation} from "./index";

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
