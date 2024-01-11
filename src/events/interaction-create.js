import bot from "../bot.js";
import { DataAccessFactory } from "../database/data-access-factory.js";
import config from "../config/config.js";

export default async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    /*
    * Cooldown
    */

    const userCooldown = await bot.scheduler.drive.jobs({ 
        name: "cooldown", 
        "data.user_id": interaction.user.id, 
        "data.commandName": command.data.name 
    });

    const defaultlCooldown = 0; // no cooldown

    if (userCooldown.length >= 1) {
        const user = userCooldown[0];
        const expiredTimestamp = Math.round(user.attrs.data.endDate / 1000);
        return interaction.reply({ 
            content: `As Vegito hones his strength between battles, embrace this **cooldown** to recharge. Your next praise will be even more powerful.\n\n *<t:${expiredTimestamp}:R>, unleash the praise and amplify your strength!*`, ephemeral: true });
    } else {
        const cooldownAmount = (command.cooldown ?? defaultlCooldown) * 1000;

        if (cooldownAmount > 0) {
            await bot.scheduler.create("cooldown", { 
                user_id: interaction.user.id,
                commandName: command.data.name,
                endDate: Date.now() + cooldownAmount
            });
        }
    }

    /*
    * Development Server
    */

    if (config.guildId === interaction.guildId) {
        try {
            await bot.setupDatabase("development");
        } catch (e) {
            await interaction.reply(`**Development Database Not Connected:** ${e.toString()}`, { ephemeral: true });
            return;
        }
    } else {
        if (process.env.NODE_ENV === "production") {
            await bot.setupDatabase(process.env.NODE_ENV);
        } else {
            await interaction.reply("Worker *Nandoka* is currently doing maintenance :3");
            return;
        }
    } 
    

    try {
        const user = await DataAccessFactory.getUser();
        await user.create(interaction.user.id);
        interaction.bot = bot;
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "Even in the face of error, Vegito's unwavering spirit remains a symbol of resilience and perseverance, transcending any temporary setback. His legacy of courage and strength echoes throughout the universe, serving as a beacon of hope and determination for all.", ephemeral: true });
        } else {
            await interaction.reply({ content: "Even amidst **error**, Vegito's unwavering spirit remains a symbol of resilience and determination, inspiring all in its wake.", ephemeral: true });
        }
    }
};