import {WebDriver} from "selenium-webdriver";
import Breadcrumbs from "./Breadcrumbs";
import Intelligence from "./Intelligence";
import Thread from "./Thread";

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
    toolbox: Toolbox,
    thread: Thread,
    briefing: Briefing,
}

export type Toolbox = {
    tools: Tool[],
}
export type Tool = {
    name: string,
    description: string,
    handler: ToolHandler<any>,
    parameters: any,
}
export type ToolHandler<Parameters> = (parameters: Parameters) => Promise<void>;
export type ToolHandlerOpenParameters = {
    id: string,
    driver: WebDriver,
    thread: Thread,
    url: string,
}
export type ToolHandlerClickParameters = {
    id: string,
    driver: WebDriver,
    thread: Thread,
    x: number,
    y: number,
}
export type ToolHandlerCloseParameters = {
    id: string,
    driver: WebDriver,
    thread: Thread,
}
export type ToolHandlerWaitParameters = {
    id: string,
    driver: WebDriver,
    thread: Thread,
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
