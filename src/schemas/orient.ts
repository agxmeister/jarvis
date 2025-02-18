export const orientResponseSchema = {
    name: "response",
    strict: true,
    schema: {
        type: "object",
        properties: {
            observation: {
                description: "Your interpretation of the current application's state.",
                type: "string",
            },
            completed: {
                description: "Status of the current step. True, if you consider it passed.",
                type: "boolean",
            },
            comment: {
                description: "Describe in your own word, do you consider the current step passed or not.",
                type: "string",
            },
        },
        required: ["observation", "completed", "comment"],
        additionalProperties: false,
    },
};
