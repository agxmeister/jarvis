import {dependencies, Screenshot} from "./types";
import {inject, injectable} from "inversify";

@injectable()
export default class Breadcrumbs
{
    readonly baseUrl: string;
    constructor(@inject(dependencies.BreadcrumbsBaseUrl) baseUrl: string) {
        this.baseUrl = baseUrl;
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
