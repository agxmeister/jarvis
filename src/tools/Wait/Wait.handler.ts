import {z as zod} from "zod";
import {schema} from "./Wait.schema";
import {Handler} from "../../ooda/toolbox";

export const handler: Handler<zod.infer<typeof schema>> = async (
    id, context, parameters
): Promise<void> => {
    const waitTime = parameters.milliseconds;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    context.properties.thread.addToolMessage(`Waited for ${waitTime} milliseconds.`, id);
}
