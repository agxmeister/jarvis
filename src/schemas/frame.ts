export const frameResponseSchema = {
    type: "object",
    properties: {
        steps: {
            type: "array",
            items: {
                type: "object",
                description: "The list of steps to perform to complete the scenario",
                properties: {
                    name: {
                        description: "Unique and concise name of the step, self-explaining its essence.",
                        type: "string",
                    },
                    action: {
                        description: "Explanation of what exactly must be done to complete this step and proceed to the next step.",
                        type: "string",
                    },
                    expectation: {
                        description: "Expectation of what exactly should happen after completion of this step.",
                        type: "string",
                    },
                },
                required: ["name", "action", "expectation"],
                additionalProperties: false,
            },
        },
    },
    required: ["steps"],
    additionalProperties: false,
};
