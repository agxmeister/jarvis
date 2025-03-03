import {z as zod} from "zod";

export const schema = zod.object({
    url: zod
        .string()
        .describe("URL to open in browser."),
});
