export default class Breadcrumbs
{
    async addScreenshot(screenshot: Buffer): Promise<string>
    {
        const result = await fetch("https://breadcrumbs.agxmeister.services/api/screenshots", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.BREADCRUMBS_ACCESS_TOKEN}`,
            },
            body: screenshot,
        });
        const data = await result.json();

        return data.id;
    }
}
