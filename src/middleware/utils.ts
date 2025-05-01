import {Handler, Context, Middleware} from "./index";

export const getMiddlewareRunner = <State extends Record<string, any>, Data>(
    handlers: Handler<State, Data>[],
    context: Context<State, Data>,
    indent = 0,
) => async () => handlers[indent](
    context,
    indent < handlers.length - 1
        ? getMiddlewareRunner(handlers, context, indent + 1)
        : async () => {
            return;
        },
);

export const getMiddlewareHandlers = <State extends Record<string, any>, Data>(
    middlewares: Middleware<State, Data>[]
) => middlewares.map(middleware => middleware.handler.bind(middleware));
