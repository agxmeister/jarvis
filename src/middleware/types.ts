export interface Middleware<Data> {
    process(data: Data): Promise<Data>;
}
