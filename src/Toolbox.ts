import {
    Toolbox,
    ToolHandlerClickParameters,
    ToolHandlerCloseParameters,
    ToolHandlerOpenParameters,
    ToolHandlerWaitParameters
} from "./types";

export const toolbox: Toolbox = {
    tools: [{
        name: "open",
        description: "Open the given URL on browser's screen.",
        handler: async (parameters: ToolHandlerOpenParameters): Promise<void> => {
            await parameters.driver.get('https://example.com');
            await parameters.driver.manage().window().setRect({
                width: 800,
                height: 600,
            });
            await parameters.driver.get(parameters.url);
            parameters.thread.addToolMessage(`Requested page was opened.`, parameters.id);
        },
        parameters: {
            type: "object",
            properties: {
                url: {
                    type: "string",
                    description: "URL to open in browser.",
                },
            },
            required: ["url"],
        },
    }, {
        name: "click",
        description: "On the current browser's screen move the mouse pointer to specified coordinates and click.",
        handler: async (parameters: ToolHandlerClickParameters): Promise<void> => {
            const actions = parameters.driver.actions({async: true});
            await actions.move({x: parameters.x, y: parameters.y}).perform();
            await actions.click().perform();
            parameters.thread.addToolMessage(`Click was performed.`, parameters.id);
        },
        parameters: {
            type: "object",
            properties: {
                x: {
                    type: "integer",
                    description: "The X coordinate to click",
                },
                y: {
                    type: "integer",
                    description: "The Y coordinate to click",
                },
            },
            required: ["x", "y"],
        }
    }, {
        name: "close",
        description: "Close the browser's screen.",
        handler: async (parameters: ToolHandlerCloseParameters): Promise<void> => {
            await parameters.driver.quit();
            parameters.thread.addToolMessage(`Browser was closed.`, parameters.id);
        },
        parameters: {},
    }, {
        name: "wait",
        description: "Do nothing.",
        handler: async (parameters: ToolHandlerWaitParameters): Promise<void> => {
            parameters.thread.addToolMessage(`Some time passed.`, parameters.id);
        },
        parameters: {},
    }],
}
