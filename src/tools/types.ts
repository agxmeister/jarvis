import {Context} from "../ooda";
import {ContextProperties} from "../types";

export type ToolContext = {
    action: string,
    context: Context<ContextProperties>,
}
