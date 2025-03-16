export type Context<Properties extends Record<string, any>> = {
    [key in keyof Properties]: Properties[key];
};
