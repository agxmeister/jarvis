import {Context} from "../index";
import {ZodObject, ZodType} from "zod";

export type Tool<Parameters extends Record<string, any>> = {
    name: string,
    description: string,
    schema: ZodObject<{[key in keyof Parameters]: ZodType<Parameters[key]>}>,
    handler: Handler<Parameters>,
}

export type Handler<Parameters> = (id: string, context: Context<any>, parameters: Parameters) => Promise<void>;
