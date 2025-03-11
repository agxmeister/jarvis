import {Checkpoint} from "./Checkpoint";

export interface Checklist<Properties extends Record<string, any>> {
    checkpoints: Checkpoint<Properties>[];
}
