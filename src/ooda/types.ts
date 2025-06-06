import {Context, Observation, Orientation, Decision} from "./index";
import {Toolbox} from "../toolbox";
import {Checkpoint} from "../checklist";
import {Handler} from "../middleware";

export type Handlers = {
    preface?: (parameters: PrefaceParameters<Record<string, any>, Record<string, any>>) => Promise<void>,
    observe: (parameters: ObserveParameters<Record<string, any>, Record<string, any>, Record<string, any>>) => Promise<Observation<Record<string, any>>>,
    orient: (parameters: OrientParameters<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>) => Promise<Orientation<Record<string, any>>>,
    decide: (parameters: DecideParameters<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>) => Promise<Decision<Record<string, any>>>,
    act: (parameters: ActParameters<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>) => Promise<void>,
    conclude?: (parameters: ConcludeParameters<Record<string, any>, Record<string, any>>) => Promise<void>,
}

export type Middlewares = {
    observe: Handler<Observation<Record<string, any>>, State>[],
    orient: Handler<Orientation<Record<string, any>>, State>[],
    decide: Handler<Decision<Record<string, any>>, State>[],
}

export type State = {
    checkpointCompleted: boolean,
}

export type PrefaceParameters<ContextProperties extends Record<string, any>, Runtime extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox<Runtime>,
}

export type ObserveParameters<ContextProperties extends Record<string, any>, CheckpointProperties extends Record<string, any>, Runtime extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox<Runtime>,
    checkpoint: Checkpoint<CheckpointProperties>,
}

export type OrientParameters<ContextProperties extends Record<string, any>, CheckpointProperties extends Record<string, any>, ObservationProperties extends Record<string, any>, Runtime extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox<Runtime>,
    checkpoint: Checkpoint<CheckpointProperties>,
    observation: Observation<ObservationProperties>
}

export type DecideParameters<ContextProperties extends Record<string, any>, CheckpointProperties extends Record<string, any>, OrientationProperties extends Record<string, any>, Runtime extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox<Runtime>,
    checkpoint: Checkpoint<CheckpointProperties>,
    orientation: Orientation<OrientationProperties>
}

export type ActParameters<ContextProperties extends Record<string, any>, CheckpointProperties extends Record<string, any>, DecisionProperties extends Record<string, any>, Runtime extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox<Runtime>,
    checkpoint: Checkpoint<CheckpointProperties>,
    decision: Decision<DecisionProperties>,
}

export type ConcludeParameters<ContextProperties extends Record<string, any>, Runtime extends Record<string, any>> = {
    context: Context<ContextProperties>,
    toolbox: Toolbox<Runtime>,
}
