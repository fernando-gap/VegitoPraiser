import { AutocompleteInteraction, CacheType } from "discord.js";
import { ContextLeaderboard, VegitoCommand } from "../interfaces.js";
import { VegitoInteraction } from "../types.js";
import ViewLeaderboard from "../views/view-leaderboard.js";
import VegitoEvent from "../events.js";

export default class Leaderboard extends VegitoEvent<VegitoCommand> {
    override async handleChatInputCommand(interaction: VegitoInteraction) {
        const context: ContextLeaderboard = { users: [] };
        const view = new ViewLeaderboard();
        let rank = await this.userDAO.selectAll({
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

    override async handleAutocomplete(_interaction: AutocompleteInteraction<CacheType>): Promise<void> {}
}
