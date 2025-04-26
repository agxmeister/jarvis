import {Orientation} from "../ooda";
import {OrientationProperties} from "../types";
import {MiddlewareContext, State} from "../ooda/types";

export const Orient = async (context: MiddlewareContext<State, Orientation<OrientationProperties>>, next: () => Promise<void>): Promise<void> =>
{
    if (context.data.completed) {
        context.state.restart = true;
        return;
    }
    await next();
}
