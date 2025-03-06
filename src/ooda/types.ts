import {Context, Scenario, Checkpoint, Observation, Orientation, Decision} from "./index";
import {Toolbox} from "./toolbox";

export type OodaParameters = {
    frame: (parameters: FrameParameters<Record<string, any>, any>) => Promise<Checkpoint<Record<string, any>>[]>,
    preface?: (parameters: PrefaceParameters<Record<string, any>>) => Promise<void>,
    observe: (parameters: ObserveParameters<Record<string, any>, Record<string, any>>) => Promise<Observation<Record<string, any>>>,
    orient: (parameters: OrientParameters<Record<string, any>, Record<string, any>, Record<string, any>>) => Promise<Orientation<Record<string, any>>>,
    decide: (parameters: DecideParameters<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>) => Promise<Decision<Record<string, any>>>,
    act: (parameters: ActParameters<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>) => Promise<void>,
    conclude?: (parameters: ConcludeParameters<Record<string, any>>) => Promise<void>,
}

export type FrameParameters<ContextProperties extends Record<string, any>, ScenarioProperties> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
    scenario: Scenario<ScenarioProperties>,
}

export type PrefaceParameters<ContextProperties extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
}

export type ObserveParameters<ContextProperties extends Record<string, any>, CheckpointProperties extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
    checkpoint: Checkpoint<CheckpointProperties>,
}

export type OrientParameters<ContextProperties extends Record<string, any>, CheckpointProperties extends Record<string, any>, ObservationProperties extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
    checkpoint: Checkpoint<CheckpointProperties>,
    observation: Observation<ObservationProperties>
}

export type DecideParameters<ContextProperties extends Record<string, any>, CheckpointProperties extends Record<string, any>, ObservationProperties extends Record<string, any>, OrientationProperties extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
    checkpoint: Checkpoint<CheckpointProperties>,
    observation: Observation<ObservationProperties>
    orientation: Orientation<OrientationProperties>
}

export type ActParameters<ContextProperties extends Record<string, any>, CheckpointProperties extends Record<string, any>, ObservationProperties extends Record<string, any>, OrientationProperties extends Record<string, any>, DecisionProperties extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
    checkpoint: Checkpoint<CheckpointProperties>,
    observation: Observation<ObservationProperties>,
    orientation: Orientation<OrientationProperties>,
    decision: Decision<DecisionProperties>,
}

export type ConcludeParameters<ContextProperties extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox,
}
