import {WebDriver} from "selenium-webdriver";
import Breadcrumbs from "./Breadcrumbs";
import Prophet from "./Prophet";
import Thread from "./Thread";
import Narration from "./Narration";

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
    prophet: Prophet,
    thread: Thread,
    briefing: Briefing,
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
