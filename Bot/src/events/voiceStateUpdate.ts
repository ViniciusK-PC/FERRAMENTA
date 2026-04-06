import {
  Events,
  VoiceState,
  ChannelType,
  PermissionFlagsBits,
  CategoryChannel,
} from 'discord.js';
import BotClient from '../client';
import config from '../config';

export const name = Events.VoiceStateUpdate;
export const once = false;

export async function execute(
  client: BotClient,
  oldState: VoiceState,
  newState: VoiceState
): Promise<void> {
  const member = newState.member ?? oldState.member;
  if (!member || member.user.bot) return; // ignora bots

  // ──────────────────────────────────────────────
  // 1. USUÁRIO ENTROU NO CANAL GATILHO → Cria canal
  // ──────────────────────────────────────────────
  if (newState.channelId === config.triggerChannelId) {
    const guild = newState.guild;

    // Resolve nome do canal: substitui {user} pelo nome do membro
    const channelName = config.channelName.replace(
      '{user}',
      member.displayName
    );

    // Sempre usa a mesma categoria do canal gatilho
    let parentCategory: CategoryChannel | null = null;
    const triggerChannel = guild.channels.cache.get(config.triggerChannelId);
    if (triggerChannel?.parent?.type === ChannelType.GuildCategory) {
      parentCategory = triggerChannel.parent as CategoryChannel;
    }

    try {
      // Cria o canal de voz temporário
      const tempChannel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildVoice,
        parent: parentCategory ?? undefined,
        userLimit: config.userLimit > 0 ? config.userLimit : undefined,
        permissionOverwrites: [
          {
            // Dono do canal tem permissão para gerenciar
            id: member.id,
            allow: [
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.MuteMembers,
              PermissionFlagsBits.DeafenMembers,
              PermissionFlagsBits.MoveMembers,
            ],
          },
        ],
      });

      // Registra o canal temporário no mapa do cliente
      client.tempChannels.set(member.id, tempChannel.id);

      // Move o usuário para o novo canal
      await member.voice.setChannel(tempChannel);

      console.log(
        `[Join-to-Create] ✅ Canal "${tempChannel.name}" criado para ${member.user.tag}`
      );
    } catch (error) {
      console.error(
        `[Join-to-Create] ❌ Erro ao criar canal para ${member.user.tag}:`,
        error
      );
    }
  }

  // ──────────────────────────────────────────────
  // 2. USUÁRIO SAIU DE UM CANAL TEMPORÁRIO → Deleta se vazio
  // ──────────────────────────────────────────────
  if (oldState.channelId && oldState.channelId !== config.triggerChannelId) {
    const leftChannel = oldState.channel;
    if (!leftChannel) return;

    // Verifica se o canal que o usuário saiu é um canal temporário
    const isTemp = client.tempChannels.some(
      (channelId) => channelId === leftChannel.id
    );

    if (isTemp && leftChannel.members.size === 0) {
      // Encontra o dono do canal para limpar o mapa
      const ownerId = client.tempChannels.findKey(
        (channelId) => channelId === leftChannel.id
      );
      if (ownerId) client.tempChannels.delete(ownerId);

      try {
        await leftChannel.delete('Canal temporário vazio — auto-deletado');
        console.log(
          `[Join-to-Create] 🗑️  Canal "${leftChannel.name}" deletado (vazio)`
        );
      } catch (error) {
        console.error(
          `[Join-to-Create] ❌ Erro ao deletar canal "${leftChannel.name}":`,
          error
        );
      }
    }
  }
}
