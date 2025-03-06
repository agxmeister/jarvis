export default class Checkpoint<Properties extends Record<string, any>>
{
    constructor (readonly name: string, readonly properties: Properties)
    {
    }
}
