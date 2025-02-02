import Actor from "./Actor";
import {container} from "./container";
import {dependencies} from "./dependencies";
import {briefing} from "../data/briefing/briefing";

const test = async () => {
    const actor = await container.getAsync<Actor>(dependencies.Actor);
    await actor.process(briefing, briefing.narrative);
};

test();
