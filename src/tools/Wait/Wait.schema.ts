import {z as zod} from "zod";

export const schema = zod.object({
    milliseconds: zod.number().describe("Time to wait in milliseconds"),
}).strict();
