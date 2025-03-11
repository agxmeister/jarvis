export interface Checkpoint<Properties extends Record<string, any>> {
    name: string;
    properties: Properties;
}
