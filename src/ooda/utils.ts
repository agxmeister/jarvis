import {Middleware, MiddlewareContext} from "./types";

export const getMiddlewareRunner = <Data>(
    middlewares: Middleware<Data>[],
    context: MiddlewareContext<Data>,
    indent = 0,
) => async () => middlewares[indent](
    context,
    indent < middlewares.length - 1
        ? getMiddlewareRunner(middlewares, context, indent + 1)
        : async () => {
            return;
        },
);
