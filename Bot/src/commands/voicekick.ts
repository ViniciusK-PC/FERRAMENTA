import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import BotClient from '../client';

export const data = new SlashCommandBuilder()
  .setName('voicekick')
  .setDescription('Expulsa (kick) um usuário do seu canal de voz temporário')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('O usuário a ser expulso')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction, client: BotClient) {
  const member = interaction.member as GuildMember;
  const channelId = member.voice.channelId;

  if (!channelId) {
    return interaction.reply({ content: '❌ Você precisa estar em um canal de voz!', ephemeral: true });
  }

  // Verifica se o membro que executou o comando é o dono de um canal
  const ownerId = client.tempChannels.findKey((id) => id === channelId);
  
  if (ownerId !== interaction.user.id) {
    return interaction.reply({ content: '❌ Apenas o dono do canal pode usar este comando!', ephemeral: true });
  }

  const targetMember = interaction.options.getMember('user') as GuildMember;
  
  if (!targetMember) {
    return interaction.reply({ content: '❌ Usuário não encontrado no servidor!', ephemeral: true });
  }

  if (targetMember.voice.channelId !== channelId) {
    return interaction.reply({ content: '❌ O usuário não está no seu canal de voz!', ephemeral: true });
  }

  try {
    await targetMember.voice.disconnect("Kickado pelo dono do canal temporário");
    await interaction.reply({ content: `✅ **${targetMember.user.tag}** foi expulso do seu canal de voz!`, ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Houve um erro ao tentar expulsar o usuário.', ephemeral: true });
  }
}
