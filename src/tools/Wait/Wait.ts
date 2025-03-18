import {z as zod} from "zod";
import {schema} from "./Wait.schema";
import {handler} from "./Wait.handler";
import {Tool} from "../../toolbox";
import {Runtime} from "../types";

export const Wait: Tool<zod.infer<typeof schema>, Runtime> = {
    name: "Wait",
    description: "Wait for a specified amount of time.",
    schema: schema,
    handler: handler,
}
