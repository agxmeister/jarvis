import {z as zod} from "zod";
import {schema} from "./Wait.schema";
import {Handler} from "../../ooda/toolbox";
import {ToolContext} from "../types";

export const handler: Handler<zod.infer<typeof schema>, ToolContext> = async (
    parameters, context
): Promise<void> => {
    const waitTime = parameters.milliseconds;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    context.context.properties.thread.addToolMessage(`Waited for ${waitTime} milliseconds.`, context.action);
}
