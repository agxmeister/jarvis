import {z as zod} from "zod";

export const schema = zod.object({
    x: zod.number().int().describe("The X coordinate to click"),
    y: zod.number().int().describe("The Y coordinate to click"),
});
