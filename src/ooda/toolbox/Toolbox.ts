import {Tool} from "./types";

export default class Toolbox<Runtime extends Record<string, any>>
{
    constructor(readonly tools: Tool<Record<string, any>, Runtime>[])
    {
    }

    async apply(name: string, parameters: Record<string, any>, runtime: Runtime): Promise<void>
    {
        await this.tools
            .find((tool) => tool.name === name)
            ?.handler(parameters, runtime);
    }
}
