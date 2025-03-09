import {Checkpoint} from "./Checkpoint";

export class Checklist<Properties extends Record<string, any>>
{
    constructor(readonly checkpoints: Checkpoint<Properties>[])
    {
    }
}
