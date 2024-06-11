import {
  AudioPlayerStatus,
  AudioResource,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  demuxProbe,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  CacheType,
  ChatInputCommandInteraction,
  VoiceChannel,
} from "discord.js";
import { createReadStream, readdirSync } from "fs";
import path from "path";
import config from "../../config.js";
import { Debug } from "../../debug.js";
import VegitoEvent from "../../events.js";
import { VegitoSubCommand } from "../../interfaces.js";
import ViewLofiJoin from "../../views/view-lofi-join.js";

export default class Join extends VegitoEvent<VegitoSubCommand> {
  private static audioPlayer = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  });
  private static hasResourcesBeenSet = false;
  private audioResources: AudioResource[] = [];
  private audioIndex = 0;
  override async handleChatInputCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    const channel = interaction.options.getChannel("channel") as VoiceChannel;

    const view = new ViewLofiJoin();
    await interaction.reply(
      view.frontend({
        channelId: channel.id,
      }),
    );

    const connection = joinVoiceChannel({
      adapterCreator: channel.guild.voiceAdapterCreator,
      channelId: channel.id,
      guildId: channel.guildId,
    });

    this.setupAudioPlayer();

    connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
      Debug.log("voice connection (old/new)", oldState.status, newState.status);

      connection.subscribe(Join.audioPlayer);
    });
  }

  private async setupAudioPlayer() {
    if (!Join.hasResourcesBeenSet) {
      const audioFiles = readdirSync(config.voicePath);

      for await (const audio of this.probeAndCreateResource(audioFiles)) {
        this.audioResources.push(audio);
      }

      Join.audioPlayer.on("error", (error) => {
        Debug.error(
          `Error: ${error.message} with resource ${(error.resource as any).metadata.title}`,
        );
      });

      Join.audioPlayer.play(this.getNextResource());

      Join.audioPlayer.on(AudioPlayerStatus.Idle, () => {
        Join.audioPlayer.play(this.getNextResource());
      });
      Join.hasResourcesBeenSet = true;
    }
  }

  async *probeAndCreateResource(audioFiles: string[]) {
    for (const audio of audioFiles) {
      const pathToAudio = path.join(config.voicePath, audio);
      const { stream, type } = await demuxProbe(createReadStream(pathToAudio));
      yield createAudioResource(stream, { inputType: type });
    }
  }

  getNextResource(): AudioResource {
    if (this.audioIndex < this.audioResources.length) {
      return this.audioResources[++this.audioIndex];
    }
    this.audioIndex = 0;
    return this.audioResources[this.audioIndex];
  }
}
