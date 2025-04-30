export interface Middleware<State extends Record<string, any>, Payload> {
    //process(context: Context<State, Payload>, next: () => Promise<void>): Promise<void>;
    process: Handler<State, Payload>
}

export type Handler<State extends Record<string, any>, Payload> = (
    context: Context<State, Payload>,
    next: () => Promise<void>,
) => Promise<void>

export type Context<State extends Record<string, any>, Payload> = {
    state: State,
    payload: Payload,
}
