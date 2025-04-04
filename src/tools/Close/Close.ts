import {z as zod} from "zod";
import {schema} from "./Close.schema";
import {handler} from "./Close.handler";
import {Tool} from "../../toolbox";
import {Runtime} from "../types";

export const Close: Tool<zod.infer<typeof schema>, Runtime> = {
    name: "Close",
    description: "Close the current browser tab.",
    schema: schema,
    handler: handler,
}
