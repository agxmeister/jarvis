import {Context} from "../index";
import {ZodObject, ZodType} from "zod";

export type Tool<Parameters extends Record<string, any>> = {
    name: string,
    description: string,
    schema: ZodObject<{[key in keyof Parameters]: ZodType<Parameters[key]>}>,
    handler: Handler<Parameters>,
}

export type Handler<Parameters extends Record<string, any>> =
    (id: string, context: Context<Record<string, any>>, parameters: Parameters) => Promise<void>;
