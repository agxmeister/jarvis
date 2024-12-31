export interface Screenshot
{
    id: string,
    url: string,
}

export interface Tool
{
    name: string,
    parameters: any,
}

export interface Step
{
    name: string,
    action: string,
    expectation: string,
    status: "planned" | "failed" | "completed"
}
