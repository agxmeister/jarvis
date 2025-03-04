import {z as zod} from "zod";

export {frameResponseSchema} from './frame';
export {orientResponseSchema} from './orient';

export const closeToolSchema = zod.object({});

export const waitToolSchema = zod.object({});
