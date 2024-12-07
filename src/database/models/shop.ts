import { BelongsToMany, Column, Model, Table } from "sequelize-typescript";
import Inventory from "./inventory.js";
import User from "./user.js";

@Table({ timestamps: false })
export default class Shop extends Model {
  @Column
  declare code: string;

  @Column
  declare name: string;

  @Column
  declare price: number;

  @Column
  declare description: string;

  @Column
  declare emoji: string;

  @BelongsToMany(() => User, () => Inventory)
  declare users: User[];
}
