import { Client, GatewayIntentBits, Collection } from 'discord.js';

// Extensão do cliente para armazenar canais temporários criados
class BotClient extends Client {
  // Map: userId -> voiceChannelId (para saber qual canal pertence a quem)
  public tempChannels: Collection<string, string> = new Collection();
  // Map: commandName -> command object
  public commands: Collection<string, any> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
      ],
    });
  }
}

export default BotClient;
