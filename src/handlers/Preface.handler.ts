import {PrefaceParameters} from "../ooda/types";
import {ContextProperties} from "../types";

export const Preface = async ({
    context: {properties: {briefing, thread}},
}: PrefaceParameters<ContextProperties>) => {
    thread.addBriefing(briefing.execution);
};
