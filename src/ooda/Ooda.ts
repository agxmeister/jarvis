import {OodaParameters} from "./types";
import {Context, Scenario, Checkpoint} from "./index";
import {Toolbox} from "../types";

export default class Ooda
{
    constructor(readonly handlers: OodaParameters)
    {
    }

    async process(context: Context<any>, toolbox: Toolbox, scenario: Scenario<any>): Promise<boolean>
    {
        const checkpoints = await this.handlers.frame({
            context: context,
            toolbox: toolbox,
            scenario: scenario,
        });
        if (this.handlers.preface) {
            await this.handlers.preface({
                context: context,
                toolbox: toolbox,
            });
        }
        for (const checkpoint of checkpoints) {
            const completed = await this.processCheckpoint(context, toolbox, checkpoint);
            if (!completed) {
                return false;
            }
        }
        if (this.handlers.conclude) {
            await this.handlers.conclude({
                context: context,
                toolbox: toolbox,
            });
        }
        return true;
    }

    private async processCheckpoint(context: Context<any>, toolbox: Toolbox, checkpoint: Checkpoint<any>): Promise<boolean>
    {
        for (let j = 0; j < 5; j++) {
            const observation = await this.handlers.observe({
                context: context,
                toolbox: toolbox,
                checkpoint: checkpoint,
            });
            const orientation = await this.handlers.orient({
                context: context,
                toolbox: toolbox,
                checkpoint: checkpoint,
                observation: observation,
            });
            if (orientation.progression) {
                return true;
            }
            const decision = await this.handlers.decide({
                context: context,
                toolbox: toolbox,
                checkpoint: checkpoint,
                observation: observation,
                orientation: orientation,
            });
            await this.handlers.act({
                context: context,
                toolbox: toolbox,
                checkpoint: checkpoint,
                observation: observation,
                orientation: orientation,
                decision: decision,
            });
        }
        return false;
    }
}
