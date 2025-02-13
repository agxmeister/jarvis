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
    tools: {
        open: {
            handler: (url: string, driver: WebDriver, breadcrumbs: Breadcrumbs) => Promise<Screenshot>,
            description: string,
            parameters: any,
        }
        click: {
            handler: (x: number, y: number, driver: WebDriver, breadcrumbs: Breadcrumbs) => Promise<Screenshot>,
            description: string,
            parameters: any,
        },
        close: {
            handler: (driver: WebDriver) => Promise<void>,
            description: string,
            parameters: any,
        },
        wait: {
            handler: () => Promise<void>,
            description: string,
            parameters: any,
        }
    },
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
