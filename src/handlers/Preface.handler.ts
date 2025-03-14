import {PrefaceParameters} from "../ooda/types";
import {ContextProperties} from "../types";
import {Runtime} from "../tools/types";

export const Preface = async ({
    context: {properties: {briefing, thread}},
}: PrefaceParameters<ContextProperties, Runtime>) => {
    thread.addBriefing(briefing.execution);
};
