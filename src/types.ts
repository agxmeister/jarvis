import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";

export interface Screenshot
{
    id: string,
    url: string,
}

export interface Action
{
    id: string,
    name: string,
    parameters: any,
}

export interface Briefing
{
    strategy: string,
    planning: string,
    execution: string,
}

export interface Step
{
    name: string,
    action: string,
    expectation: string,
}

export type Orientation = {
    observation: string,
    completed: boolean,
    comment: string,
}
