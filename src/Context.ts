import {WebDriver} from "selenium-webdriver";
import Breadcrumbs from "./Breadcrumbs";
import Prophet from "./Prophet";
import Thread from "./Thread";

export default class Context
{
    constructor(
        readonly driver: WebDriver,
        readonly breadcrumbs: Breadcrumbs,
        readonly prophet: Prophet,
        readonly thread: Thread,
    )
    {
    }
}
