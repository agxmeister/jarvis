import {Context} from "../index";
import {Tool} from "./types";

export default class Toolbox
{
    constructor(readonly tools: Tool<Record<string, any>>[])
    {
    }

    async apply(toolName: string, toolParameters: Record<string, any>, toolApplicationId: string, context: Context<Record<string, any>>): Promise<any>
    {
        const tool = this.tools.find((tool) => tool.name === toolName);
        if (!tool) {
            return null;
        }
        return await tool.handler(toolApplicationId, context, toolParameters);
    }
}
