import {Context, Scenario, Checkpoint, Observation, Orientation, Decision} from "./index";

export type OodaParameters = {
    frame: (parameters: FrameParameters<any, any>) => Promise<Checkpoint<any>[]>,
    observe: (parameters: ObserveParameters<any, any>) => Promise<Observation<any>>,
    orient: (parameters: OrientParameters<any, any, any>) => Promise<Orientation<any>>,
    decide: (parameters: DecideParameters<any, any, any, any>) => Promise<Decision<any>>,
    act: (parameters: ActParameters<any, any, any, any, any>) => Promise<void>,
}

export type FrameParameters<ContextProperties, ScenarioProperties> = {
    context: Context<ContextProperties>,
    scenario: Scenario<ScenarioProperties>,
}

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
