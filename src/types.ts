import { CacheType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js"
import { Model } from "sequelize-typescript";
import User from "./database/models/user.js";
import { CommandRaw, ContextRaw, VegitoCommand, VegitoSubCommand } from "./interfaces.js";

export type Reply = {
    content?: string,
    ephemeral?: boolean
    embeds?: EmbedBuilder[],
}


type VegitoInteractionOptions = {
    user: VegitoUser;
}

export type VegitoUser = User & Model<{}, {}>;
export type VegitoInteraction = ChatInputCommandInteraction<CacheType> & { bot: VegitoInteractionOptions };


 /*
 * https://stackoverflow.com/questions/55166230/sequelize-typescript-typeof-model
 */
export type Constructor<T> = new (...args: any[]) => T;
export type ModelType<T extends Model<T>> = Constructor<T> & typeof Model;


export type ContextHelp = ContextRaw & CommandRaw[];
export type ContextShop = ContextRaw & {
    name: string,
    code: string,
    description: string
    price: string
    emoji: string
}[]

export type CommandType = VegitoCommand | VegitoSubCommand;


/* return from queries used in data access to provide good generics and typing */
export type QueryReturn<M extends Model> = M & Model<{}, {}>