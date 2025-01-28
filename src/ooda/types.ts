import Context from "./Context";
import Checkpoint from "./Checkpoint";

export type ObserveParameters<ContextProperties, CheckpointProperties> = {
    context: Context<ContextProperties>,
    checkpoint: Checkpoint<CheckpointProperties>,
}
