import {Context, Scenario, Checkpoint, Observation, Orientation, Decision} from "./index";
import Toolbox from "../Toolbox";

export type OodaParameters = {
    frame: (parameters: FrameParameters<any, any>) => Promise<Checkpoint<any>[]>,
    preface?: (parameters: PrefaceParameters<any>) => Promise<void>,
    observe: (parameters: ObserveParameters<any, any>) => Promise<Observation<any>>,
    orient: (parameters: OrientParameters<any, any, any>) => Promise<Orientation<any>>,
    decide: (parameters: DecideParameters<any, any, any, any>) => Promise<Decision<any>>,
    act: (parameters: ActParameters<any, any, any, any, any>) => Promise<void>,
    conclude?: (parameters: ConcludeParameters<any>) => Promise<void>,
}

export type FrameParameters<ContextProperties, ScenarioProperties> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
    scenario: Scenario<ScenarioProperties>,
}

export type PrefaceParameters<ContextProperties> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
}

export type ObserveParameters<ContextProperties, CheckpointProperties> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
    checkpoint: Checkpoint<CheckpointProperties>,
}

export type OrientParameters<ContextProperties, CheckpointProperties, ObservationProperties> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
    checkpoint: Checkpoint<CheckpointProperties>,
    observation: Observation<ObservationProperties>
}

export type DecideParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
    checkpoint: Checkpoint<CheckpointProperties>,
    observation: Observation<ObservationProperties>
    orientation: Orientation<OrientationProperties>
}

export type ActParameters<ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties, DecisionProperties> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
    checkpoint: Checkpoint<CheckpointProperties>,
    observation: Observation<ObservationProperties>,
    orientation: Orientation<OrientationProperties>,
    decision: Decision<DecisionProperties>,
}

export type ConcludeParameters<ContextProperties> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
}
