import {z as zod} from "zod";
import {schema} from "./Close.schema";
import {Handler} from "../../ooda/toolbox";
import {ToolContext} from "../types";

export const handler: Handler<zod.infer<typeof schema>, ToolContext> = async (
    parameters, context
): Promise<void> => {
    await context.context.properties.driver.close();
    context.context.properties.thread.addToolMessage(`Browser tab was closed.`, context.action);
}
