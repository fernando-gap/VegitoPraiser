import { ContextLeaderboard, VegitoCommand } from "../interfaces.js";
import ViewLeaderboard from "../views/view-leaderboard.js";
import VegitoEvent from "../events.js";
import { CacheType, ChatInputCommandInteraction } from "discord.js";

export default class Leaderboard extends VegitoEvent<VegitoCommand> {
    override async handleChatInputCommand(interaction: ChatInputCommandInteraction<CacheType>) {
        const context: ContextLeaderboard = { users: [] };
        const view = new ViewLeaderboard();
        const rank = await this.userDAO.selectAll({
            query: {
                limit: 10,
                offset: 0,
                order: [["praiseCount", "DESC"]]
            }
        });

        context.users = rank.filter(v => v.dataValues.praiseCount > 0)
            .map(v => ({
                id: v.dataValues.id,
                praiseCount: v.dataValues.praiseCount
            }))
        
        await interaction.reply(view.frontend(context))
    }
}
