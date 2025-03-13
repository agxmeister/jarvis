import {z as zod} from "zod";
import {schema} from "./Open.schema";
import {handler} from "./Open.handler";
import {Tool} from "../../ooda/toolbox";
import {Runtime} from "../types";

export const Open: Tool<zod.infer<typeof schema>, Runtime> = {
    name: "Open",
    description: "Open a page",
    schema: schema,
    handler: handler,
}
