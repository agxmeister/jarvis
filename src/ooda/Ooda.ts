import {Context, Handlers, Middlewares} from "./index";
import {Toolbox} from "../toolbox";
import {Checklist, Checkpoint} from "../checklist";
import {runMiddleware} from "../middleware";

export default class Ooda<ContextProperties extends Record<string, any>, CheckpointProperties extends Record<string, any>, Runtime extends Record<string, any>>
{
    static readonly CHECKPOINT_ATTEMPT_LIMIT = 5;

    constructor(readonly handlers: Handlers, readonly middlewares: Middlewares)
    {
    }

    async process(context: Context<ContextProperties>, toolbox: Toolbox<Runtime>, checklist: Checklist<CheckpointProperties>): Promise<boolean>
    {
        if (this.handlers.preface) {
            await this.handlers.preface({
                context: context,
                toolbox: toolbox,
            });
        }

        for (const checkpoint of checklist.checkpoints) {
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

    private async processCheckpoint(context: Context<ContextProperties>, toolbox: Toolbox<Runtime>, checkpoint: Checkpoint<CheckpointProperties>): Promise<boolean>
    {
        for (let j = 0; j < Ooda.CHECKPOINT_ATTEMPT_LIMIT; j++) {
            const {payload: observation} = await runMiddleware(
                this.middlewares.observe,
                await this.handlers.observe({
                    context: context,
                    toolbox: toolbox,
                    checkpoint: checkpoint,
                }),
            )

            const {payload: orientation, state: orientationState} = await runMiddleware(
                this.middlewares.orient,
                await this.handlers.orient({
                    context: context,
                    toolbox: toolbox,
                    checkpoint: checkpoint,
                    observation: observation,
                }),
                {
                    checkpointCompleted: false,
                }
            );
            if (orientationState!.checkpointCompleted) {
                return true;
            }

            const {payload: decision} = await runMiddleware(
                this.middlewares.decide,
                await this.handlers.decide({
                    context: context,
                    toolbox: toolbox,
                    checkpoint: checkpoint,
                    orientation: orientation,
                }),
            );

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
