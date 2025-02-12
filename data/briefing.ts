export const briefing = {
    strategy: `
        Your objective is to test the application.
    `,
    planning: `
        The user Screenwriter will provide you with the test scenario. You must decompose this scenario into steps,
        trying to keep the steps as small to be able to complete them in one action,
        like clicking a button, filling out a form, etc.
    `,
    execution: `
        Let's follow through the test scenario iteratively, step-by-step.
        
        At the beginning of each iteration, the user Narrator will inform you about the current step
        and the application's state, providing a screenshot or its text description.
        
        In return, you have to describe your interpretation of the application's state and report
        the status of the current step.
        
        If you report the current step is complete, Narrator will inform you about the next step.
        You will be asked to call the tool of your choice to move further through the test scenario.
    `,
};
