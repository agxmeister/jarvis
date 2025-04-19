import {z as zod} from 'zod';

export const followChecklistResponseSchema = zod.object({
    observation: zod.string()
        .describe("Your interpretation of the current application's state."),
    completed: zod.boolean()
        .describe("Status of the current step. True, if you consider it passed."),
    comment: zod.string()
        .describe("Describe in your own word, do you consider the current step passed or not."),
}).strict()
    .describe("Schema of the current checkpoint state data.");
