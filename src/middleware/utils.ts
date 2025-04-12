import {Middleware} from "./types";

export const processMiddlewares = async <Data>(
    middlewares: Middleware<Data>[],
    data: Data,
): Promise<Data> => {
    return (await middlewares.reduce(
        async (acc, middleware) =>
            await middleware.process(await acc),
        Promise.resolve(data),
    ));
}
