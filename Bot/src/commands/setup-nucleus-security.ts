import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits, 
  ChannelType, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} from 'discord.js';
import BotClient from '../client';
import config from '../config';

export const data = new SlashCommandBuilder()
  .setName('setup-nucleus-security')
  .setDescription('Cria a categoria e o canal privado para geração de hashes do Núcleo')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction, client: BotClient) {
  if (!interaction.guild) return;

  await interaction.deferReply({ ephemeral: true });

  try {
    const channels = await interaction.guild.channels.fetch();

    // 1. Localizar ou Criar Categoria "Nucleo Usuario"
    let category = channels.find(
      c => c?.type === ChannelType.GuildCategory && 
           (c.name.toUpperCase().includes('NUCLEO USUARIO') || c.name.toUpperCase().includes('NÚCLEO USUÁRIO'))
    );

    if (!category) {
      category = await interaction.guild.channels.create({
        name: 'Nucleo Usuario',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel],
          }
        ]
      });
    }

    // 2. Criar ou Localizar Canal "binario"
    let channel = channels.find(
      c => c?.name.toLowerCase() === 'binario' && c?.parentId === category?.id
    );

    if (!channel) {
      channel = await interaction.guild.channels.create({
        name: 'binario',
        type: ChannelType.GuildText,
        parent: category.id,
      });
    }

    // 3. Enviar Interface de Geração (LastPass Style)
    const embed = new EmbedBuilder()
      .setTitle('🛡️ GERADOR DE HASHES OFFENSIVAS')
      .setDescription(
        'Gere instantaneamente uma hash aleatória e segura para acessar o **Núcleo de Inteligência Hex Stalcke**.\n\n' +
        `**Seu link de acesso será:** \`${config.dashboardUrl}/<HASH_GERADA>\`\n` +
        '⚠️ **Aviso:** Após gerada a credencial, você terá apenas 10 segundos para acessar!\n\n' +
        '**Selecione o nível de segurança desejado abaixo:**'
      )
      .setColor(0xCC0000)
      .setThumbnail('https://i.imgur.com/8Q9Z5bQ.png') // Ícone Hex Stalcke
      .addFields(
        { name: '🔥 Assinatura Binária', value: 'Gera uma sequência complexa para imersão total.', inline: true },
        { name: '🔐 Hardened Hash', value: '256 bits de entropia aleatória.', inline: true }
      )
      .setFooter({ text: 'Hex Stalcke Intelligence Nucleus • Baixo Nível Operacional' });

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('gen_hash_short')
          .setLabel('Hash Rápida')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('gen_hash_secure')
          .setLabel('Hardened (Segura)')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('gen_hash_binary')
          .setLabel('Assinatura Binária')
          .setStyle(ButtonStyle.Primary)
      );

    if (channel?.isTextBased()) {
      await (channel as any).send({ embeds: [embed], components: [row] });
    }

    await interaction.editReply({ 
      content: `✅ Sistema de Segurança configurado com sucesso em: <#${channel?.id}>` 
    });

  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: '❌ Erro ao configurar o Núcleo de Segurança.' });
  }
}
