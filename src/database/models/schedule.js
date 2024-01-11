import User from "./user.js";

export default (driver, DataTypes) => {
    const modelSchedule = driver.define("Schedule", {
        /* what channel the user enabled the notification system */
        channel_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        /* the date user enabled daily notification system */
        last_praise: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }, 
        /* if user enabled hourly notification system (optional) */
        has_hourly_reminder: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    User(driver, DataTypes).hasOne(modelSchedule, {
        foreignKey: {
            name: "user_id",
            type: DataTypes.STRING,
            unique: "fk_unique_schedule"
        }
    });

    return modelSchedule;
};