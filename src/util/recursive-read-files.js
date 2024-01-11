import { readdir } from "fs/promises";
import { isAbsolute, resolve } from "path";

export default async (dirname) => {
    if (!isAbsolute(dirname)) {
        dirname = resolve(import.meta.dirname, dirname);
    }

    return (await readdir(dirname, { recursive: true }))
        .filter(value => value.endsWith("js"))
        .map(value => `${dirname}/${value}`);
};