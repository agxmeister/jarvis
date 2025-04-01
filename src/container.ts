import {Container} from "inversify";
import {dependencies} from "./dependencies";
import Intelligence from "./intelligence/Intelligence";
import Breadcrumbs from "./Breadcrumbs";
import Actor from "./Actor";
import {Builder} from "selenium-webdriver";
import OpenAI from "openai";
import Dumper from "./Dumper";
import Browser from "./Browser";
import {Middleware} from "./intelligence";
import {Dump, Log} from "./intelligence/middlewares";

const container = new Container();

container.bind<Actor>(dependencies.Actor).to(Actor);
container.bind<Builder>(dependencies.WebDriverBuilder).toDynamicValue(
    () => new Builder()
);
container.bind<Browser>(dependencies.Browser).to(Browser);
container.bind<Intelligence>(dependencies.Intelligence).to(Intelligence);
container.bind<OpenAI>(dependencies.OpenAi).toDynamicValue(
    () => new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })
);
container.bind<Dumper>(dependencies.Dumper).to(Dumper);
container.bind<string>(dependencies.DumperStoragePath).toConstantValue(process.env.DUMPER_STORAGE_PATH ?? "");
container.bind<Breadcrumbs>(dependencies.Breadcrumbs).to(Breadcrumbs);
container.bind<string>(dependencies.BreadcrumbsBaseUrl).toConstantValue(process.env.BREADCRUMBS_BASE_URL ?? "");

container.bind<Middleware>(dependencies.Middleware).to(Log).inSingletonScope();
container.bind<Middleware>(dependencies.Middleware).to(Dump).inSingletonScope();

export {container};
