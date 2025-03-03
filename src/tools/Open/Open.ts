import {z as zod} from "zod";
import {schema} from "./Open.schema";
import {handler} from "./Open.handler";
import {Tool} from "../../ooda/toolbox";

export const Open: Tool<zod.infer<typeof schema>> = {
    name: 'Open',
    description: 'Open a page',
    schema: schema,
    handler: handler,
}
