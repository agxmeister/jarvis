import {OrientParameters, Orientation} from "../ooda";
import {ContextProperties, CheckpointProperties, ObservationProperties, OrientationProperties} from "../types";
import {Runtime} from "../tools/types";
import {getNarration} from "../utils";
import {orientSchema} from "../schemas";
import {z as zod} from "zod/lib";

export const Orient = async ({
    context: {intelligence, thread},
    toolbox,
    checkpoint,
    observation,
}: OrientParameters<ContextProperties, CheckpointProperties, ObservationProperties, Runtime>) => {
    const data: OrientationProperties = (
        await intelligence.think(
            thread,
            getNarration(checkpoint, observation.properties),
            toolbox,
            orientSchema,
        )
    ) as zod.infer<typeof orientSchema>;
    return new Orientation(data.completed, data);
};
