import {z as zod} from "zod";
import {schema} from "./Close.schema";
import {Handler} from "../../ooda/toolbox";

export const handler: Handler<zod.infer<typeof schema>> = async (
    id, context, parameters
): Promise<void> => {
    await context.properties.driver.close();
    context.properties.thread.addToolMessage(`Browser tab was closed.`, id);
}
