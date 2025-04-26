import {Orientation, State} from "../ooda";
import {Context} from "../ooda/middleware";
import {OrientationProperties} from "../types";

export const Orient = async (context: Context<State, Orientation<OrientationProperties>>, next: () => Promise<void>): Promise<void> =>
{
    if (context.payload.completed) {
        context.state.restart = true;
        return;
    }
    await next();
}
