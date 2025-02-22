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
    tools: Tool<any>[],
}

export type Tool<Handler> = {
    name: string,
    description: string,
    handler: Handler,
    parameters: any,
}

export type ToolHandler<Parameters> = (parameters: Parameters) => Promise<void>;

export type ToolOpenHandler = ToolHandler<ToolOpenParameters>;
export type ToolClickHandler = ToolHandler<ToolClickParameters>;
export type ToolCloseHandler = ToolHandler<ToolCloseParameters>;
export type ToolWaitHandler = ToolHandler<ToolWaitParameters>;

export type ToolOpenParameters = {
    id: string,
    driver: WebDriver,
    thread: Thread,
    url: string,
}
export type ToolClickParameters = {
    id: string,
    driver: WebDriver,
    thread: Thread,
    x: number,
    y: number,
}
export type ToolCloseParameters = {
    id: string,
    driver: WebDriver,
    thread: Thread,
}
export type ToolWaitParameters = {
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
