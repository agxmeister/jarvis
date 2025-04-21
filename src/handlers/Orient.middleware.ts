import {Orientation} from "../ooda";
import {OrientationProperties} from "../types";

export const Orient = async (orientation: Orientation<OrientationProperties>): Promise<boolean> =>
{
    return orientation.completed;
}
