import {z as zod} from "zod";

export {frameResponseSchema} from './frame';
export {orientResponseSchema} from './orient';

export const clickToolSchema = zod.object({
    x: zod.number().int().describe("The X coordinate to click"),
    y: zod.number().int().describe("The Y coordinate to click"),
});

export const closeToolSchema = zod.object({});

export const waitToolSchema = zod.object({});
