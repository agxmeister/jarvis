import {Orientation} from "../ooda";
import {OrientationProperties} from "../types";

export const Proceed = async (orientation: Orientation<OrientationProperties>): Promise<boolean> =>
{
    return orientation.completed;
}
