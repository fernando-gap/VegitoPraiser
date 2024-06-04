import {
  AllowNull,
  Column,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({ timestamps: false })
export default class Reminder extends Model {
  @PrimaryKey
  @Column
  declare id: number;

  @AllowNull(false)
  @Column
  declare reminder: string;
}
