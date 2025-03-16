import {PrefaceParameters} from "../ooda/types";
import {ContextProperties} from "../types";
import {Runtime} from "../tools/types";

export const Conclude = async ({
    context: {browser}
}: PrefaceParameters<ContextProperties, Runtime>) => {
    await  browser.close();
};
