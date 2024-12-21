import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import {Screenshot} from "./types";

@injectable()
export default class Breadcrumbs
{
    constructor(@inject(dependencies.BreadcrumbsBaseUrl) readonly baseUrl: string)
    {
    }

    async addScreenshot(screenshot: string): Promise<Screenshot>
    {
        const result = await fetch(`${this.baseUrl}/api/screenshots`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.BREADCRUMBS_ACCESS_TOKEN}`,
            },
            body: Buffer.from(screenshot, 'base64'),
        });

        const data = await result.json();

        return {
            id: data.id,
            url: this.getScreenshotUrl(data.id),
        };
    }

    getScreenshotUrl(id: string): string
    {
        return `${this.baseUrl}/screenshots/${id}`;
    }
}
