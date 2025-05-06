import {Handler, Context, Middleware} from "./index";

export const getMiddlewareRunner = <Data, State extends Record<string, any>>(
    handlers: Handler<Data, State>[],
    context: Context<Data, State>,
    indent = 0,
) =>
    handlers.length > indent
        ? async () => handlers[indent](
            context,
            handlers.length > indent + 1
                ? getMiddlewareRunner(handlers, context, indent + 1)
                : async () => {},
        )
        : async () => {};

export const getMiddlewareHandlers = <Data, State extends Record<string, any>>(
    middlewares: Middleware<Data, State>[]
) => middlewares.map(middleware => middleware.handler.bind(middleware));
