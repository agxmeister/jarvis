import {Orientation} from "../ooda";
import {OrientationProperties} from "../types";

export const Orient = async (orientation: Orientation<OrientationProperties>, next: () => Promise<boolean>): Promise<boolean> =>
{
    if (orientation.completed) {
        return true;
    }
    return await next();
}
