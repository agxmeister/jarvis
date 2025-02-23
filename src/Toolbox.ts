import {
    ContextProperties,
    Toolbox,
    ToolHandlerClickParameters,
    ToolHandlerCloseParameters,
    ToolHandlerOpenParameters,
    ToolHandlerWaitParameters
} from "./types";
import {Context} from "./ooda";

export const toolbox: Toolbox = {
    tools: [{
        name: "open",
        description: "Open the given URL on browser's screen.",
        handler: async (id: string, context: Context<ContextProperties>, parameters: ToolHandlerOpenParameters): Promise<void> => {
            await context.properties.driver.get('https://example.com');
            await context.properties.driver.manage().window().setRect({
                width: 800,
                height: 600,
            });
            await context.properties.driver.get(parameters.url);
            context.properties.thread.addToolMessage(`Requested page was opened.`, id);
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
        handler: async (id: string, context: Context<ContextProperties>, parameters: ToolHandlerClickParameters): Promise<void> => {
            const actions = context.properties.driver.actions({async: true});
            await actions.move({x: parameters.x, y: parameters.y}).perform();
            await actions.click().perform();
            context.properties.thread.addToolMessage(`Click was performed.`, id);
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
        handler: async (id: string, context: Context<ContextProperties>, _: ToolHandlerCloseParameters): Promise<void> => {
            await context.properties.driver.quit();
            context.properties.thread.addToolMessage(`Browser was closed.`, id);
        },
        parameters: {},
    }, {
        name: "wait",
        description: "Do nothing.",
        handler: async (id: string, context: Context<ContextProperties>, _: ToolHandlerWaitParameters): Promise<void> => {
            context.properties.thread.addToolMessage(`Some time passed.`, id);
        },
        parameters: {},
    }],
}
