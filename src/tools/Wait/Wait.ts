import {z as zod} from "zod";
import {schema} from "./Wait.schema";
import {handler} from "./Wait.handler";
import {Tool} from "../../ooda/toolbox";
import {ToolContext} from "../types";

export const Wait: Tool<zod.infer<typeof schema>, ToolContext> = {
    name: "Wait",
    description: "Wait for a specified amount of time.",
    schema: schema,
    handler: handler,
}
