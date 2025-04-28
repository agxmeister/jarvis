export interface Middleware<Context> {
    process(context: Context): Promise<void>;
}
