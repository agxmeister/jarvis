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

export type ToolOpenHandler = (url: string, driver: WebDriver) => Promise<void>;
export type ToolClickHandler = (x: number, y: number, driver: WebDriver) => Promise<void>;
export type ToolCloseHandler = (driver: WebDriver) => Promise<void>;
export type ToolWaitHandler = () => Promise<void>;

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
