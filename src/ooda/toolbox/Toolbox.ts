import {Context} from "../index";
import {Tool} from "./types";

export default class Toolbox
{
    constructor(readonly tools: Tool<any>[])
    {
    }

    async apply(toolName: string, toolParameters: any, toolApplicationId: string, context: Context<any>): Promise<any>
    {
        const tool = this.tools.find((tool) => tool.name === toolName);
        if (!tool) {
            return null;
        }
        return await tool.handler(toolApplicationId, context, toolParameters);
    }
}
