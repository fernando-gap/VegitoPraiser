import { Model } from "sequelize-typescript";
import {
  CommandRaw,
  ContextRaw,
  VegitoCommand,
  VegitoSubCommand,
} from "./interfaces.js";

/*
 * https://stackoverflow.com/questions/55166230/sequelize-typescript-typeof-model
 */
export type Constructor<T> = new (...args: any[]) => T;
export type ModelType<T extends Model<T>> = Constructor<T> & typeof Model;

export type ContextHelp = ContextRaw & CommandRaw[];
export type ContextShop = ContextRaw &
  {
    name: string;
    code: string;
    description: string;
    price: string;
    emoji: string;
  }[];

export type CommandType = VegitoCommand | VegitoSubCommand;

/* return from queries used in data access to provide good generics and typing */
export type QueryReturn<M extends Model> = M & Model<object, object>;
