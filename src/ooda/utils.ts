import {Middleware, MiddlewareContext} from "./types";

export const getMiddlewareRunner = <State extends Record<string, any>, Data>(
    middlewares: Middleware<State, Data>[],
    context: MiddlewareContext<State, Data>,
    indent = 0,
) => async () => middlewares[indent](
    context,
    indent < middlewares.length - 1
        ? getMiddlewareRunner(middlewares, context, indent + 1)
        : async () => {
            return;
        },
);
