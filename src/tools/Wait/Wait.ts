import {z as zod} from "zod";
import {schema} from "./Wait.schema";
import {handler} from "./Wait.handler";
import {Tool} from "../../ooda/toolbox";

export const Wait: Tool<zod.infer<typeof schema>> = {
    name: "Wait",
    description: "Wait for a specified amount of time.",
    schema: schema,
    handler: handler,
}
