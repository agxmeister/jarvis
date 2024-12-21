import OpenAI from "openai";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import {Container} from "inversify";
import {dependencies} from "./types";
import Actor from "./Actor";
import {Browser, Builder, WebDriver} from "selenium-webdriver";

const container = new Container();
container.bind<Prophet>(dependencies.Prophet).to(Prophet);
container.bind<Breadcrumbs>(dependencies.Breadcrumbs).to(Breadcrumbs);
container.bind<Actor>(dependencies.Actor).to(Actor);
container.bind<WebDriver>(dependencies.WebDriver).toDynamicValue(async () => await new Builder()
    .forBrowser(Browser.CHROME)
    .build()
);
container.bind<OpenAI>(dependencies.OpenAi).toDynamicValue(() => new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
}));
container.bind<string>(dependencies.BreadcrumbsBaseUrl).toConstantValue(process.env.BREADCRUMBS_BASE_URL)

const test = async () => {

    const actor = await container.getAsync<Actor>(dependencies.Actor);
    await actor.act();
}

test();
