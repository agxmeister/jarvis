import {z as zod} from "zod";
import {schema} from "./Wait.schema";
import {Handler} from "../../ooda/toolbox";
import {Runtime} from "../types";

export const handler: Handler<zod.infer<typeof schema>, Runtime> = async (
    parameters, runtime
): Promise<void> => {
    const waitTime = parameters.milliseconds;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    runtime.context.thread.addToolMessage(`Waited for ${waitTime} milliseconds.`, runtime.action);
}
