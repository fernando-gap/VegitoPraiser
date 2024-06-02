import { Column, Table, Model, PrimaryKey, AllowNull, Default, DataType, BelongsTo, ForeignKey, BelongsToMany } from "sequelize-typescript"
import Reminder from "./reminder.js";
import Shop from "./shop.js";
import Inventory from "./inventory.js";

@Table
export default class User extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @ForeignKey(() => Reminder)
    @Column
    declare reminderId: number;

    @BelongsTo(() => Reminder, 'reminderId')
    declare reminder: Reminder

    @Default(0)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare potaraCoins: number

    @Default(0)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare praiseCount: number

    @BelongsToMany(() => Shop, () => Inventory)
    declare shopItems: Shop[]
}