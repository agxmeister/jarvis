import {Handler, Context} from "./index";

export const getMiddlewareRunner = <State extends Record<string, any>, Data>(
    middlewares: Handler<State, Data>[],
    context: Context<State, Data>,
    indent = 0,
) => async () => middlewares[indent](
    context,
    indent < middlewares.length - 1
        ? getMiddlewareRunner(middlewares, context, indent + 1)
        : async () => {
            return;
        },
);
