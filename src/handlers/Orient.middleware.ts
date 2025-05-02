import {Orientation, State} from "../ooda";
import {Context} from "../middleware";
import {OrientationProperties} from "../types";

export const Gatekeeper = async (context: Context<State, Orientation<OrientationProperties>>, next: () => Promise<void>): Promise<void> =>
{
    if (context.payload.completed) {
        context.state.restart = true;
        return;
    }
    await next();
}
