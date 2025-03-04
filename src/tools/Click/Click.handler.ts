import {z as zod} from "zod";
import {schema} from "./Click.schema";
import {Handler} from "../../ooda/toolbox";

export const handler: Handler<zod.infer<typeof schema>> = async (
    id, context, parameters
): Promise<void> => {
    const actions = context.properties.driver.actions({async: true});
    await actions.move({x: parameters.x, y: parameters.y}).perform();
    await actions.click().perform();
    context.properties.thread.addToolMessage(`Click was performed.`, id);
}
