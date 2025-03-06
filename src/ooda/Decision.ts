export default class Decision<Properties extends Record<string, any>>
{
    constructor (readonly properties: Properties)
    {
    }
}
