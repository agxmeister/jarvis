import {WebDriver} from "selenium-webdriver";
import Breadcrumbs from "./Breadcrumbs";
import Intelligence from "./Intelligence";
import Thread from "./Thread";
import {Context} from "./ooda";

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

export type ContextProperties = {
    driver: WebDriver,
    breadcrumbs: Breadcrumbs,
    intelligence: Intelligence,
    thread: Thread,
    briefing: Briefing,
}

export type Toolbox = {
    tools: Tool[],
}
export type Tool = {
    name: string,
    description: string,
    handler: ToolHandler,
    parameters: any,
}
export type ToolHandler = (id: string, context: Context<any>, parameters: any) => Promise<void>;
export type ToolHandlerOpenParameters = {
    url: string,
}
export type ToolHandlerClickParameters = {
    x: number,
    y: number,
}
export type ToolHandlerCloseParameters = {
}
export type ToolHandlerWaitParameters = {
}

export interface CheckpointProperties
{
    name: string,
    action: string,
    expectation: string,
}

export type ObservationProperties = {
    pageUrl: string,
    pageScreenshotUrl: string,
    pageDescription: string,
}

export type OrientationProperties = {
    observation: string,
    completed: boolean,
    comment: string,
}

export type DecisionProperties = {
    actions: Action[],
}
