import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Shop from "./shop.js";
import User from "./user.js";

@Table({ timestamps: false })
export default class Inventory extends Model {
  @ForeignKey(() => Shop)
  @Column
  declare shopId: number;

  @ForeignKey(() => User)
  @Column
  declare userId: string;
}
