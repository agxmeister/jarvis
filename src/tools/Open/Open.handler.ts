import {z as zod} from "zod";
import {schema} from "./Open.schema";
import {Handler} from "../../ooda/toolbox";
import {ToolContext} from "../types";

export const handler: Handler<zod.infer<typeof schema>, ToolContext> = async (
    parameters, context
) => {
    await context.context.properties.driver.get('https://example.com');
    await context.context.properties.driver.manage().window().setRect({
        width: 800,
        height: 600,
    });
    await context.context.properties.driver.get(parameters.url);
    context.context.properties.thread.addToolMessage(`Requested page was opened.`, context.action);
}
