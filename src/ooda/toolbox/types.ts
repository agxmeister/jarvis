import {Context} from "../index";

export type Tool = {
    name: string,
    description: string,
    parameters: ToolParameter[],
    handler: ToolHandler,
}

export type ToolParameter = {
    name: string,
    description: string,
    type: string,
}

export type ToolHandler = (id: string, context: Context<any>, parameters: any) => Promise<void>;
