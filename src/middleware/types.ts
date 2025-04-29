export interface Middleware<Context> {
    process(context: Context, next: () => Promise<void>): Promise<void>;
}
