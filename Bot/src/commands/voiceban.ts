import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, VoiceChannel } from 'discord.js';
import BotClient from '../client';

export const data = new SlashCommandBuilder()
  .setName('voiceban')
  .setDescription('Bane um usuário do seu canal de voz temporário')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('O usuário a ser banido')
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

  const voiceChannel = member.voice.channel as VoiceChannel;

  try {
    // Negar permissão de conectar para o alvo
    await voiceChannel.permissionOverwrites.edit(targetMember.id, {
      Connect: false
    });

    // Desconecta se estiver no canal
    if (targetMember.voice.channelId === channelId) {
      await targetMember.voice.disconnect("Banido pelo dono do canal temporário");
    }

    await interaction.reply({ content: `✅ **${targetMember.user.tag}** foi banido do seu canal de voz!`, ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Houve um erro ao tentar banir o usuário.', ephemeral: true });
  }
}
