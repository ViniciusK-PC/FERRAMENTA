import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits, 
  ChannelType, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  StringSelectMenuBuilder 
} from 'discord.js';
import BotClient from '../client';

export const data = new SlashCommandBuilder()
  .setName('setup-pass-gen')
  .setDescription('Cria o canal central REX-STALKE com o gerador de acessos estilo LastPass.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction, client: BotClient) {
  if (!interaction.guild) return;

  await interaction.deferReply({ ephemeral: true });

  try {
    // 1. Localizar ou Criar Categoria "Comandos BOT"
    const channels = await interaction.guild.channels.fetch();
    
    let category = channels.find(
      c => c?.name.toUpperCase().startsWith('COMANDOS BOT') && c?.type === ChannelType.GuildCategory
    );

    if (!category) {
      category = await interaction.guild.channels.create({
        name: 'Comandos BOT ⏳',
        type: ChannelType.GuildCategory,
      });
    }

    // 2. Criar ou Localizar Canal "binario"
    let channel = channels.find(
      c => (c?.name.toLowerCase() === 'binario' || c?.name.toLowerCase().includes('hash')) && c?.parentId === category?.id
    );

    if (!channel) {
      channel = await interaction.guild.channels.create({
        name: 'binario',
        type: ChannelType.GuildText,
        parent: category.id,
      });
    }

    // 3. Estado Inicial: Length=16, Upper=T, Lower=T, Numbers=T, Symbols=T
    const initialState = '16:1:1:1:1';

    const embed = new EmbedBuilder()
      .setTitle('🛡️ GERADOR DE ACESSOS - HEX STALCKE')
      .setDescription(
        'Gere senhas de segurança criptográficas em tempo real. Configure os parâmetros abaixo e clique em **⚡ Gerar Acesso**.'
      )
      .setColor(0xCC0000) // Vermelho escuro estilo LastPass/Hex
      .setThumbnail('https://i.imgur.com/8Q9Z5bQ.png')
      .addFields(
        { name: '🔑 ÚLTIMA HASH GERADA', value: '`Nenhuma gerada ainda`' },
        { name: '⚙️ CONFIGURAÇÃO ATUAL', value: '`Tamanho: 16 | ABC: ON | abc: ON | 123: ON | #$!: ON`' }
      )
      .setFooter({ text: 'Hex Stalcke intelligence Nucleus • Toolset' });

    // Components Row 1: Select Menu (Length)
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`pg_len:${initialState}`)
      .setPlaceholder('Selecione o tamanho da senha')
      .addOptions(
        [8, 12, 16, 20, 24, 32, 48, 64].map(len => ({
          label: `${len} caracteres`,
          value: len.toString(),
          default: len === 16
        }))
      );

    // Components Row 2: Toggles
    const togglesRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`pg_tg_U:${initialState}`).setLabel('ABC [ON]').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`pg_tg_L:${initialState}`).setLabel('abc [ON]').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`pg_tg_N:${initialState}`).setLabel('123 [ON]').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`pg_tg_S:${initialState}`).setLabel('#$! [ON]').setStyle(ButtonStyle.Success)
    );

    // Components Row 3: Action Buttons
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`pg_gen:${initialState}`).setLabel('⚡ Gerar Acesso').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`pg_copy:${initialState}`).setLabel('📋 Copiar').setStyle(ButtonStyle.Secondary)
    );

    const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    if (channel?.isTextBased()) {
      await (channel as any).send({ 
        embeds: [embed], 
        components: [row1, togglesRow, actionRow] 
      });
    }

    await interaction.editReply({ 
      content: `✅ Painel de Geração de Acessos configurado em <#${channel?.id}>` 
    });

  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: '❌ Erro ao configurar o Gerador de Acessos.' });
  }
}
