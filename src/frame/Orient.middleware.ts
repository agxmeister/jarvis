import {Orientation, State} from "../ooda";
import {Context} from "../middleware";
import {OrientationProperties} from "../types";

export const Gatekeeper = async (context: Context<Orientation<OrientationProperties>, State>, next: () => Promise<void>): Promise<void> =>
{
    if (context.payload.completed) {
        context.state!.checkpointCompleted = true;
        return;
    }
    await next();
}
