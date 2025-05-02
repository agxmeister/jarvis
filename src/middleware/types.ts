export interface Middleware<Payload, State extends Record<string, any>> {
    handler: Handler<Payload, State>
}

export type Handler<Payload, State extends Record<string, any>> = (
    context: Context<Payload, State>,
    next: () => Promise<void>,
) => Promise<void>

export type Context<Payload, State extends Record<string, any>> = {
    payload: Payload,
    state?: State,
}
