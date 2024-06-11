import {
  AllowNull,
  Column,
  Default,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Shop from "./shop.js";
import User from "./user.js";

@Table({ timestamps: false })
export default class Inventory extends Model {
  @ForeignKey(() => Shop)
  @AllowNull(false)
  @Column
  declare shopId: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  declare userId: string;

  @Default(0)
  @AllowNull(false)
  @Column
  declare amount: number;
}
