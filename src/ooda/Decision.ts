import {Orientation} from "./index";

export default class Decision<Properties>
{
    constructor(readonly orientation: Orientation<any>, readonly properties: Properties)
    {
    }
}
