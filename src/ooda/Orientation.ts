import {Observation} from "./index";

export default class Orientation<Properties>
{
    constructor (
        readonly observation: Observation<any>,
        readonly progression: boolean,
        readonly properties: Properties,
    )
    {
    }
}
