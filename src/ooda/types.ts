import {Context, Checkpoint, Observation} from "./index";

export type ObserveParameters<ContextProperties, CheckpointProperties> = {
    context: Context<ContextProperties>,
    checkpoint: Checkpoint<CheckpointProperties>,
}

export type OrientParameters<ContextProperties, OrientationProperties> = {
    context: Context<ContextProperties>,
    observation: Observation<OrientationProperties>
}
