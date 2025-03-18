import {z as zod} from "zod";
import {schema} from "./Click.schema";
import {Handler} from "../../toolbox";
import {Runtime} from "../types";

export const handler: Handler<zod.infer<typeof schema>, Runtime> = async (
    parameters, runtime
): Promise<void> => {
    const page = await runtime.context.browser.getCurrentPage();
    const actions = page.actions({async: true});
    await actions.move({x: parameters.x, y: parameters.y}).perform();
    await actions.click().perform();
    runtime.context.thread.addToolMessage(`Click was performed.`, runtime.action);
}
