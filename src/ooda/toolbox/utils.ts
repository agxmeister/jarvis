import {Toolbox} from "./types";

export const apply = async <Runtime extends Record<string, any>>(
    toolbox: Toolbox<Runtime>,
    name: string,
    parameters: Record<string, any>,
    runtime: Runtime,
) => {
    await toolbox.tools
        .find((tool) => tool.name === name)
        ?.handler(parameters, runtime);
}
