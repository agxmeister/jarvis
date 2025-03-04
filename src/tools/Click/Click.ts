import {z as zod} from "zod";
import {schema} from "./Click.schema";
import {handler} from "./Click.handler";
import {Tool} from "../../ooda/toolbox";

export const Click: Tool<zod.infer<typeof schema>> = {
    name: "Click",
    description: "On the current browser's screen move the mouse pointer to specified coordinates and click.",
    schema: schema,
    handler: handler,
}
