import {Tool} from "./types";

export default class Toolbox
{
    constructor(readonly tools: Tool<Record<string, any>, Record<string, any>>[])
    {
    }

    async apply(toolName: string, toolParameters: Record<string, any>, toolContext: Record<string, any>): Promise<any>
    {
        const tool = this.tools
            .find((tool) => tool.name === toolName);
        if (!tool) {
            return null;
        }
        return await tool.handler(toolParameters, toolContext);
    }
}
