import {Tool} from "./types";

export default class Toolbox<Runtime extends Record<string, any>>
{
    constructor(readonly tools: Tool<Record<string, any>, Runtime>[])
    {
    }

    async apply(name: string, parameters: Record<string, any>, runtime: Runtime): Promise<any>
    {
        const tool = this.tools
            .find((tool) => tool.name === name);
        if (!tool) {
            return null;
        }
        return await tool.handler(parameters, runtime);
    }
}
