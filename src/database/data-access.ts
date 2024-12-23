import { Model, Sequelize } from "sequelize-typescript";
import {
  DatabaseFetchVegitoError,
  QueryOptionsVegitoError,
} from "../errors.js";
import {
  CreateInventoryOptions,
  CreateOptions,
  CreateUserOptions,
  FindAllOptions,
  FindOneOptions,
  IncrementOptions,
  Select,
  UpdateReminderOptions,
  UserItemsOptions,
} from "../interfaces.js";
import { ModelType, QueryReturn } from "../types.js";
import Inventory from "./models/inventory.js";
import Shop from "./models/shop.js";
import User from "./models/user.js";

abstract class DataAccess<M extends Model> {
  protected abstract model: ModelType<Model>;

  constructor(protected db: Sequelize) {}

  async selectOne(select: Select<FindOneOptions>) {
    return this.model.findOne({
      ...select.query,
      transaction: select.extra?.transaction,
    }) as Promise<QueryReturn<M> | null>;
  }

  async selectAll(select: Select<FindAllOptions>) {
    return this.model.findAll({
      ...select.query,
      transaction: select.extra?.transaction,
    }) as Promise<QueryReturn<M>[]>;
  }

  async create(data: any, options: CreateOptions) {
    return await this.model.create(data, options);
  }

  async increment(select: Select<IncrementOptions>): Promise<void> {
    if (select.extra !== undefined) {
      const data = await this.selectOne(select);
      if (data !== null) {
        await data.increment(select.extra.incrementColumns, {
          transaction: select.extra.transaction,
        });
      } else {
        const error = new DatabaseFetchVegitoError(
          "selectOne",
          "the where clause is incorrect or value does not exist",
        );
        error.report();
      }
    }
  }
}

export class DataAccessUser extends DataAccess<User> {
  protected model: ModelType<User> = User;

  async createUser(select: Select<CreateUserOptions>) {
    if (select.extra !== undefined) {
      return await this.model.findOrCreate({
        ...select.query,
        defaults: select.extra.defaults,
        transaction: select.extra.transaction,
      });
    }
    throw new QueryOptionsVegitoError(
      "findOrCreate options",
      "property named `extra` is missing",
    );
  }

  async updateReminder(select: Select<UpdateReminderOptions>) {
    if (select.extra !== undefined) {
      await this.model.update(
        {
          reminderId: select.extra.newReminderId,
        },
        {
          ...select.query,
          transaction: select.extra.transaction,
        },
      );
    } else {
    }
  }
}

export class DataAccessShop extends DataAccess<Shop> {
  protected override model: ModelType<Shop> = Shop;
  async selectUserItems(select: Select<UserItemsOptions>) {
    return await this.model.findAll({
      include: [
        {
          model: User,
          required: true,
          ...select.query,
        },
      ],
      transaction: select.extra?.transaction,
    });
  }
}

export class DataAccessInventory extends DataAccess<Inventory> {
  protected override model: ModelType<Inventory> = Inventory;
  async selectOrCreate(select: Select<CreateInventoryOptions>) {
    if (select.extra !== undefined) {
      return await this.model.findOrCreate({
        ...select.query,
        defaults: select.extra.defaults,
        transaction: select.extra.transaction,
      });
    }
    throw new QueryOptionsVegitoError(
      "findOrCreate options",
      "property named `extra` is missing",
    );
  }
}
