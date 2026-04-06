import { Events, Interaction } from 'discord.js';
import BotClient from '../client';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(client: BotClient, interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(`[Erro] Falha ao executar o comando ${interaction.commandName}:`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ Houve um erro ao executar este comando!', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Houve um erro ao executar este comando!', ephemeral: true });
    }
  }
}
