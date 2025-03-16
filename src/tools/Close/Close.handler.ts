import {z as zod} from "zod";
import {schema} from "./Close.schema";
import {Handler} from "../../ooda/toolbox";
import {Runtime} from "../types";

export const handler: Handler<zod.infer<typeof schema>, Runtime> = async (
    parameters, runtime
): Promise<void> => {
    await runtime.context.browser.close();
    runtime.context.thread.addToolMessage(`Browser tab was closed.`, runtime.action);
}
