import pino, {Logger} from "pino";
import * as dayjs from 'dayjs';
import {Container} from "inversify";
import {dependencies} from "./dependencies";
import Intelligence from "./intelligence/Intelligence";
import Breadcrumbs from "./Breadcrumbs";
import Actor from "./Actor";
import {Builder} from "selenium-webdriver";
import OpenAI from "openai";
import Dumper from "./Dumper";
import Browser from "./Browser";
import {Middleware} from "./middleware";
import {ChatCompletionData} from "./intelligence";
import {KeepMessageHistory, DumpChatCompletion, LogChatCompletionMessage} from "./intelligence/middlewares";
import {Context as MiddlewareContext} from "./ooda/middleware";

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
container.bind<string>(dependencies.DumperStoragePath).toConstantValue(process.env.DUMP_PATH ?? "");
container.bind<Breadcrumbs>(dependencies.Breadcrumbs).to(Breadcrumbs);
container.bind<string>(dependencies.BreadcrumbsBaseUrl).toConstantValue(process.env.BREADCRUMBS_BASE_URL ?? "");

const now = Date.now()
container.bind<Logger>(dependencies.Logger).toDynamicValue(
    () => pino({
        level: "debug",
    }, pino.transport({
        target: 'pino-pretty',
        options: {
            destination: `${process.env.LOG_PATH}/${dayjs().format("YYYY-MM-DD")}.log`,
        },
    })),
);

container.bind<Middleware<MiddlewareContext<Record<string, any>, ChatCompletionData>>>(dependencies.Middleware).to(KeepMessageHistory).inSingletonScope();
container.bind<Middleware<MiddlewareContext<Record<string, any>, ChatCompletionData>>>(dependencies.Middleware).to(DumpChatCompletion).inSingletonScope();
container.bind<Middleware<MiddlewareContext<Record<string, any>, ChatCompletionData>>>(dependencies.Middleware).to(LogChatCompletionMessage).inSingletonScope();

export {container};
