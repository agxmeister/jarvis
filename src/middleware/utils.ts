export const processMiddlewares = async <Data>(
    middlewares: ((data: Data) => Promise<Data>)[],
    data: Data,
): Promise<Data> => {
    return (await middlewares.reduce(
        async (acc, middleware) =>
            await middleware(await acc),
        Promise.resolve(data),
    ));
}
