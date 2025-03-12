import {z as zod} from "zod";
import {schema} from "./Open.schema";
import {handler} from "./Open.handler";
import {Tool} from "../../ooda/toolbox";
import {ToolContext} from "../types";

export const Open: Tool<zod.infer<typeof schema>, ToolContext> = {
    name: "Open",
    description: "Open a page",
    schema: schema,
    handler: handler,
}
