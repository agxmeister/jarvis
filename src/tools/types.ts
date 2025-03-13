import {Context} from "../ooda";
import {ContextProperties} from "../types";

export type Runtime = {
    action: string,
    context: Context<ContextProperties>,
}
