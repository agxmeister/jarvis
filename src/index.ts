import Actor from "./Actor";
import {container} from "./container";
import {dependencies} from "./dependencies";
import Scenario from "./Scenario";
import {briefing} from "../data/briefing/briefing";

const test = async () => {
    const scenario = new Scenario(
        briefing.narrative,
        {
            strategy: briefing.strategy,
            planning: briefing.planning,
            execution: briefing.execution,
        }
    );

    const actor = await container.getAsync<Actor>(dependencies.Actor);
    await actor.process(scenario);
};

test();
