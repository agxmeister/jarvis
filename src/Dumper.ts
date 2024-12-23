import {inject, injectable} from "inversify";
import {dependencies} from "./dependencies";
import * as fs from "node:fs";

@injectable()
export default class Dumper
{
    constructor(@inject(dependencies.DumperStoragePath) readonly storagePath: string) {
    }

    public add(data: any)
    {
        fs.writeFile(
            `./logs/${Date.now()}.json`,
            JSON.stringify(data, null, 4),
            () => {},
        );
    }
}
