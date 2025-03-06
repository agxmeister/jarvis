export default class Observation<Properties extends Record<string, any>>
{
    constructor (readonly properties: Properties)
    {
    }
}
