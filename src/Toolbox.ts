import {Tool} from "./types";
import {Context} from "./ooda";

export default class Toolbox
{
    constructor(readonly tools: Tool[])
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
