import {PrefaceParameters} from "../ooda/types";
import {ContextProperties} from "../types";
import {Runtime} from "../tools/types";

export const Conclude = async ({
    context: {properties: {driver}}
}: PrefaceParameters<ContextProperties, Runtime>) => {
    if (driver) {
        await driver.quit();
    }
};
