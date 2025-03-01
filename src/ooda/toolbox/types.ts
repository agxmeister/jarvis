import {Context} from "../index";
import {ZodObject} from "zod";

export type Tool<Parameters> = {
    name: string,
    description: string,
    schema: ZodObject<any>,
    handler: Handler<Parameters>,
}

export type ToolParameter = {
    name: string,
    description: string,
    type: string,
}

export type Handler<Parameters> = (id: string, context: Context<any>, parameters: Parameters) => Promise<void>;
