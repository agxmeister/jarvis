import Actor from "./Actor";
import {container} from "./container";
import {dependencies} from "./dependencies";
import * as fs from "node:fs";
import Scenario from "./Scenario";

const test = async () => {
    const narrative = fs.readFileSync("./data/briefing/narrative.md", {encoding: "utf-8"});
    const strategy = fs.readFileSync("./data/briefing/strategy.md", {encoding: "utf-8"});
    const planning = fs.readFileSync("./data/briefing/planning.md", {encoding: "utf-8"});
    const execution = fs.readFileSync("./data/briefing/execution.md", {encoding: "utf-8"});

    const scenario = new Scenario(
        narrative,
        {
            strategy: strategy,
            planning: planning,
            execution: execution,
        }
    );

    const actor = await container.getAsync<Actor>(dependencies.Actor);
    await actor.process(scenario);
};

test();
