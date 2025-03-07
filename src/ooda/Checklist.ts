import {Checkpoint} from "./index";

export class Checklist
{
    constructor(readonly checkpoints: Checkpoint<Record<string, any>>[])
    {
    }
}
