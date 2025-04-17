export type Orientation<Properties extends Record<string, any>> = {
    [key in keyof Properties]: Properties[key];
};
