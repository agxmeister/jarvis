export const briefing = {
    strategy: `
        Your objective is to test the application.
    `,
    planning: `
        User 'Messenger' will provide you with the test scenario. You must decompose this scenario into steps,
        trying to keep the steps as small to be able to complete them in one action,
        like clicking a button, filling out a form, etc.
    `,
    execution: `
        Let's follow through the test scenario iteratively, step-by-step.
        
        At the beginning of each iteration, the user 'Narrator' will inform you about the current step
        and the application's state, providing a screenshot or its text description.
        
        In return, you have to describe your interpretation of the application's state and report
        the status of the current step.
        
        If you report the current step is complete, the user 'Narrator' will inform you about the next step.
        You will be asked to call the tool of your choice to move further through the test scenario.
    `,
    narrative: `
        You must proceed to URL 'https://test.agxmeister.services' in your browser and click on the screen
        at coordinates (100, 150). As a result, the coordinates you just clicked should appear on the screen.
    `,
    steps: [{
        observations: [
            "You see that the browser is closed.",
            "You see that the browser is open and displays blank page."
        ],
        description: "Open web browser.",
    }, {
        observation: [
            "You see that the browser is open and displays blank page.",
            "You see that the browser displays a white page with a line of text 'Hello!' in the top left corner."
        ],
        description: "Go to the URL 'https://test.agxmeister.services' in web browser.",
    }, {
        observation: [
            "You see that the browser displays coordinates 'x=100 and y=150' in the top left corner.",
            "You see that the browser displays coordinates 'x=100 and y=150' in the top left corner."
        ],
        description: "Click on screen at coordinates (100, 150).",
    }]
}
