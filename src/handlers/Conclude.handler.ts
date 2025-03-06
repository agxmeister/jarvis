import {PrefaceParameters} from "../ooda/types";
import {ContextProperties} from "../types";

export const Conclude = async ({
    context: {properties: {driver}}
}: PrefaceParameters<ContextProperties>) => {
    if (driver) {
        await driver.quit();
    }
};
