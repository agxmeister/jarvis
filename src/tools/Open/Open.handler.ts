import {z as zod} from "zod";
import {schema} from "./Open.schema";
import {Handler} from "../../ooda/toolbox";
import {Runtime} from "../types";

export const handler: Handler<zod.infer<typeof schema>, Runtime> = async (
    parameters, runtime
) => {
    await runtime.context.properties.driver.get('https://example.com');
    await runtime.context.properties.driver.manage().window().setRect({
        width: 800,
        height: 600,
    });
    await runtime.context.properties.driver.get(parameters.url);
    runtime.context.properties.thread.addToolMessage(`Requested page was opened.`, runtime.action);
}
