import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { ViewProfile } from "../views/view-profile.js";
import VegitoEvent from "../events.js";
import { CommandExecutionVegitoError } from "../errors.js";
import { VegitoCommand } from "../interfaces.js";

export default class Profile extends VegitoEvent<VegitoCommand> {
    override async handleChatInputCommand(interaction: ChatInputCommandInteraction<CacheType>) {
        if (this.user === undefined) {
            throw new CommandExecutionVegitoError("profile command", "command needs a valid user")
        }

        const view = new ViewProfile();
        await interaction.reply(view.frontend({
            userId: interaction.user.id,
            avatarURL: interaction.user.displayAvatarURL(),
            currentPotaraCoins: this.user.potaraCoins,
            currentPraiseCount: this.user.praiseCount,
        }));
    }
}