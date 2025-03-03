import {z as zod} from "zod";
import {schema} from "./Open.schema";
import {Handler} from "../../ooda/toolbox";

export const handler: Handler<zod.infer<typeof schema>> = async (
    id, context, parameters
) => {
    await context.properties.driver.get('https://example.com');
    await context.properties.driver.manage().window().setRect({
        width: 800,
        height: 600,
    });
    await context.properties.driver.get(parameters.url);
    context.properties.thread.addToolMessage(`Requested page was opened.`, id);
}
