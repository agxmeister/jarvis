import {Context} from "../index";

export type Tool = {
    name: string,
    description: string,
    handler: ToolHandler,
    parameters: any,
}

export type ToolHandler = (id: string, context: Context<any>, parameters: any) => Promise<void>;
