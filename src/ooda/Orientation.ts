export default class Orientation<Properties extends Record<string, any>>
{
    constructor (
        readonly progression: boolean,
        readonly properties: Properties,
    )
    {
    }
}
