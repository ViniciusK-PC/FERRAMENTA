import { Events } from 'discord.js';
import BotClient from '../client';

export const name = Events.ClientReady;
export const once = true;

export async function execute(client: BotClient): Promise<void> {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log(`║  ✅  Bot conectado como: ${client.user?.tag}`);
  console.log(`║  🔊  Sistema Join-to-Create ATIVO`);
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  // Define o status do bot
  client.user?.setPresence({
    activities: [{ name: '🔊 Criando canais de voz...' }],
    status: 'online',
  });
}
