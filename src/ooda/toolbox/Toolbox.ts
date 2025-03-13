import {Tool} from "./types";

export default class Toolbox
{
    constructor(readonly tools: Tool<Record<string, any>, Record<string, any>>[])
    {
    }

    async apply(name: string, parameters: Record<string, any>, runtime: Record<string, any>): Promise<any>
    {
        const tool = this.tools
            .find((tool) => tool.name === name);
        if (!tool) {
            return null;
        }
        return await tool.handler(parameters, runtime);
    }
}
