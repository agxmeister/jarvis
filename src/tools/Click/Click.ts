import {z as zod} from "zod";
import {schema} from "./Click.schema";
import {handler} from "./Click.handler";
import {Tool} from "../../ooda/toolbox";
import {ToolContext} from "../types";

export const Click: Tool<zod.infer<typeof schema>, ToolContext> = {
    name: "Click",
    description: "On the current browser's screen move the mouse pointer to specified coordinates and click.",
    schema: schema,
    handler: handler,
}
