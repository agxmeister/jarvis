export default class Context<Properties extends Record<string, any>>
{
    constructor (readonly properties: Properties)
    {
    }
}
