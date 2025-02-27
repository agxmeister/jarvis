import {Context} from "../index";

export type Tool<Parameters> = {
    name: string,
    description: string,
    parameters: ToolParameter[],
    handler: Handler<Parameters>,
}

export type ToolParameter = {
    name: string,
    description: string,
    type: string,
}

export type Handler<Parameters> = (id: string, context: Context<any>, parameters: Parameters) => Promise<void>;
