import {Container} from "inversify";
import {dependencies} from "./dependencies";
import Prophet from "./Prophet";
import Breadcrumbs from "./Breadcrumbs";
import Actor from "./Actor";
import {Browser, Builder, WebDriver} from "selenium-webdriver";
import OpenAI from "openai";
import Dumper from "./Dumper";

const container = new Container();

container.bind<Actor>(dependencies.Actor).to(Actor);
container.bind<WebDriver>(dependencies.WebDriver).toDynamicValue(
    async () => {
        const driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .build();
        await driver.get('https://example.com');
        await driver.manage().window().setRect({
            width: 800,
            height: 600,
        });
        return driver;
    }
);
container.bind<Prophet>(dependencies.Prophet).to(Prophet);
container.bind<OpenAI>(dependencies.OpenAi).toDynamicValue(
    () => new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    }));
container.bind<Dumper>(dependencies.Dumper).to(Dumper);
container.bind<string>(dependencies.DumperStoragePath).toConstantValue(process.env.DUMPER_STORAGE_PATH);
container.bind<Breadcrumbs>(dependencies.Breadcrumbs).to(Breadcrumbs);
container.bind<string>(dependencies.BreadcrumbsBaseUrl).toConstantValue(process.env.BREADCRUMBS_BASE_URL)

export {container};
