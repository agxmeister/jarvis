import {Orientation} from "../ooda";
import {OrientationProperties} from "../types";
import {MiddlewareContext} from "../ooda/types";

export const Orient = async (context: MiddlewareContext<Orientation<OrientationProperties>>, next: () => Promise<void>): Promise<void> =>
{
    if (context.data.completed) {
        context.restart = true;
        return;
    }
    await next();
}
