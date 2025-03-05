import {z as zod} from "zod";
import {schema} from "./Close.schema";
import {handler} from "./Close.handler";
import {Tool} from "../../ooda/toolbox";

export const Close: Tool<zod.infer<typeof schema>> = {
    name: "Close",
    description: "Close the current browser tab.",
    schema: schema,
    handler: handler,
}
