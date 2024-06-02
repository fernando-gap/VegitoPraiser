import { BelongsToMany, Column, Model, Table } from "sequelize-typescript";
import User from "./user.js";
import Inventory from "./inventory.js";


@Table({ timestamps: false })
export default class Shop extends Model {
    @Column   
    declare code: string

    @Column
    declare name: string

    @Column
    declare price: number

    @Column
    declare description: string

    @Column
    declare emoji: string

    @BelongsToMany(() => User, () => Inventory)
    declare users: User[]
}

// export default (driver, DataTypes) => {
//     return driver.define("Shop", {
//         code: {
//             type: DataTypes.STRING,
//             primaryKey: true
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         emoji: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         description: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         price: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         },
//     }, { timestamps: false });
// };