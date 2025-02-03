import Actor from "./Actor";
import {container} from "./container";
import {dependencies} from "./dependencies";
import {briefing, narrative} from "../data";

const test = async () => {
    const actor = await container.getAsync<Actor>(dependencies.Actor);
    await actor.process(briefing, narrative);
};

test();
