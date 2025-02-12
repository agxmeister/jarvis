import {WebDriver} from "selenium-webdriver";
import Breadcrumbs from "./Breadcrumbs";
import {Screenshot, Toolbox} from "./types";

export const toolbox: Toolbox = {
    tools: {
        open: {
            handler: async (url: string, driver: WebDriver, breadcrumbs: Breadcrumbs): Promise<Screenshot> => {
                await driver.get('https://example.com');
                await driver.manage().window().setRect({
                    width: 800,
                    height: 600,
                });
                await driver.get(url);
                return await breadcrumbs.addScreenshot((await driver.takeScreenshot()));
            },
            description: "Open the given URL on browser's screen.",
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
        },
        click: {
            handler: async (x: number, y: number, driver: WebDriver, breadcrumbs: Breadcrumbs): Promise<Screenshot> => {
                const actions = driver.actions({async: true});
                await actions.move({x: x, y: y}).perform();
                await actions.click().perform();
                return await breadcrumbs.addScreenshot((await driver.takeScreenshot()));
            },
            description: "On the current browser's screen move the mouse pointer to specified coordinates and click.",
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
        },
        close: {
            handler: async (driver: WebDriver): Promise<void> => {
                await driver.quit();
            },
            description: "Close the browser's screen.",
            parameters: {},
        },
        wait: {
            handler: async (): Promise<void> => {
            },
            description: "Do nothing.",
            parameters: {},
        }
    }
}
