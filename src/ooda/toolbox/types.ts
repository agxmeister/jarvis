import {ZodObject, ZodType} from "zod";

export interface Tool<Parameters extends Record<string, any>, Context extends Record<string, any>> {
    name: string;
    description: string;
    schema: ZodObject<{[key in keyof Parameters]: ZodType<Parameters[key]>}>;
    handler: Handler<Parameters, Context>;
}

export interface Handler<Parameters extends Record<string, any>, Context extends Record<string, any>> {
    (parameters: Parameters, context: Context): Promise<void>;
}
