import {z as zod} from "zod";
import {schema} from "./Click.schema";
import {Handler} from "../../ooda/toolbox";
import {ToolContext} from "../types";

export const handler: Handler<zod.infer<typeof schema>, ToolContext> = async (
    parameters, context
): Promise<void> => {
    const actions = context.context.properties.driver.actions({async: true});
    await actions.move({x: parameters.x, y: parameters.y}).perform();
    await actions.click().perform();
    context.context.properties.thread.addToolMessage(`Click was performed.`, context.action);
}
