import {Handler, Context, Middleware} from "./index";

export const getMiddlewareRunner = <Data, State extends Record<string, any>>(
    handlers: Handler<Data, State>[],
    context: Context<Data, State>,
    indent = 0,
) => async () => handlers[indent](
    context,
    indent < handlers.length - 1
        ? getMiddlewareRunner(handlers, context, indent + 1)
        : async () => {
            return;
        },
);

export const getMiddlewareHandlers = <Data, State extends Record<string, any>>(
    middlewares: Middleware<Data, State>[]
) => middlewares.map(middleware => middleware.handler.bind(middleware));
