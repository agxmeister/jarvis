import Browser from "./Browser";
import Breadcrumbs from "./Breadcrumbs";
import Intelligence from "./intelligence/Intelligence";
import Thread from "./intelligence/Thread";

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
    browser: Browser,
    breadcrumbs: Breadcrumbs,
    intelligence: Intelligence,
    thread: Thread,
    briefing: Briefing,
}

export interface CheckpointProperties
{
    action: string,
    expectation: string,
}

export type ObservationProperties = {
    pageUrl: string|null,
    pageScreenshotUrl: string|null,
    pageDescription?: string|null,
}

export type OrientationProperties = {
    observation: string,
    completed: boolean,
    comment: string,
}

export type DecisionProperties = {
    actions: Action[],
}
