import {z as zod} from "zod";
import {schema} from "./Open.schema";
import {Handler} from "../../ooda/toolbox";
import {Runtime} from "../types";

export const handler: Handler<zod.infer<typeof schema>, Runtime> = async (
    parameters, runtime
) => {
    const page = await runtime.context.browser.open(parameters.url);
    await page.manage().window().setRect({
        width: 800,
        height: 600,
    });
    runtime.context.thread.addToolMessage(`Requested page was opened.`, runtime.action);
}
