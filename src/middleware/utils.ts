import {Handler, Context, Middleware} from "./index";

export const runMiddleware = async <Payload, State extends Record<string, any>>(
    handlers: Handler<Payload, State>[],
    payload: Payload,
    state?: State,
) =>
{
    const context: Context<Payload, State> = {
        payload: payload,
        state: state,
    }
    await getMiddlewareRunner(handlers, context)();
    return context;
}

export const getMiddlewareRunner = <Payload, State extends Record<string, any>>(
    handlers: Handler<Payload, State>[],
    context: Context<Payload, State>,
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
