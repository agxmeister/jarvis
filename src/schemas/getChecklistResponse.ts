import {z as zod} from 'zod';

export const getChecklistResponseSchema = zod.object({
    checkpoints: zod.array(
        zod.object({
            name: zod.string()
                .describe("The unique and concise name of this checkpoint, self-explaining its essence."),
            properties: zod.object({
                action: zod.string()
                    .describe("The explanation of what must be done to pass this checkpoint and proceed to the next one."),
                expectation: zod.string()
                    .describe("The expectation of what should be observed to consider this checkpoint passed."),
            })
                .describe("Additional information associated with this checkpoint."),
        })
            .describe("The checkpoint. An intermediate result that must be achieved to follow the scenario.")
    ),
})
    .describe("Schema of the checklist data.");
