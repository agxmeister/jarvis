import {Checkpoint} from "./index";

export default class Checklist
{
    constructor(readonly checkpoints: Checkpoint<Record<string, any>>[])
    {
    }
}
