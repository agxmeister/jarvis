import {Briefing} from "./types";
import Intelligence from "./Intelligence";
import Thread from "./Thread";

export const getChecklist = async (
    narrative: string,
    briefing: Briefing,
    intelligence: Intelligence,
    thread: Thread) =>
{
    thread.addBriefing(briefing.strategy, briefing.planning);
    thread.addScenario(narrative);
    return await intelligence.getChecklist(thread);
};
