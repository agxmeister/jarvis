import Actor from "./Actor";
import {container} from "./container";
import {dependencies} from "./dependencies";

const test = async () => {
    const actor = await container.getAsync<Actor>(dependencies.Actor);
    await actor.process();
}

test();
