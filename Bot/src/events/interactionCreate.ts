import { Events, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import BotClient from '../client';
import { generatePassword, PasswordOptions } from '../utils/generatePassword';
import { validHashes } from '../index';
import config from '../config';
import { query } from '../utils/db';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(client: BotClient, interaction: Interaction): Promise<void> {
  // ── Se for um Comando de Barra (/) ──────────────────────────
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

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

  // ── Se for um Botão ou Select do Password Generator (LastPass Style) ─────
  if (interaction.isButton() || interaction.isStringSelectMenu()) {
    if (interaction.customId.startsWith('pg_')) {
      const parts = interaction.customId.split(':');
      const action = parts[0];
      let length = parseInt(parts[1], 10);
      let upper = parts[2] === '1';
      let lower = parts[3] === '1';
      let numbers = parts[4] === '1';
      let symbols = parts[5] === '1';

      // Atualiza o estado baseado na ação
      if (action === 'pg_tg_U') upper = !upper;
      else if (action === 'pg_tg_L') lower = !lower;
      else if (action === 'pg_tg_N') numbers = !numbers;
      else if (action === 'pg_tg_S') symbols = !symbols;
      else if (interaction.isStringSelectMenu() && action === 'pg_len') {
        length = parseInt(interaction.values[0], 10);
      }

      const state = `${length}:${upper ? '1' : '0'}:${lower ? '1' : '0'}:${numbers ? '1' : '0'}:${symbols ? '1' : '0'}`;
      
      let currentPassword = '`Nenhuma gerada ainda`';
      // Se tiver uma embed anterior, tenta pegar o valor da senha se foi apenas uma mudança de configuração
      const oldEmbed = interaction.message.embeds[0];
      if (oldEmbed && oldEmbed.fields.length > 0) {
        currentPassword = oldEmbed.fields[0].value;
      }

      if (action === 'pg_gen') {
        currentPassword = `\`\`\`${generatePassword({ length, upper, lower, numbers, symbols })}\`\`\``;
        await interaction.deferUpdate();
      } else if (action === 'pg_copy') {
        const pass = currentPassword.replace(/```/g, '');
        if (pass === 'Nenhuma gerada ainda') {
          await interaction.reply({ content: '❌ Gere uma senha primeiro!', ephemeral: true });
          return;
        }
        await interaction.reply({ content: `🔐 Sua senha: \`${pass}\``, ephemeral: true });
        return;
      } else {
        await interaction.deferUpdate();
      }

      // Reconstrói a interface
      const embed = new EmbedBuilder()
        .setTitle('🛡️ GERADOR DE ACESSOS - HEX STALCKE')
        .setDescription('Gere senhas de segurança criptográficas em tempo real. Configure os parâmetros abaixo e clique em **⚡ Gerar Acesso**.')
        .setColor(0xCC0000)
        .setThumbnail('https://i.imgur.com/8Q9Z5bQ.png')
        .addFields(
          { name: '🔑 ÚLTIMA HASH GERADA', value: currentPassword },
          { name: '⚙️ CONFIGURAÇÃO ATUAL', value: `\`Tamanho: ${length} | ABC: ${upper ? 'ON' : 'OFF'} | abc: ${lower ? 'ON' : 'OFF'} | 123: ${numbers ? 'ON' : 'OFF'} | #$!: ${symbols ? 'ON' : 'OFF'}\`` }
        )
        .setFooter({ text: 'Hex Stalcke intelligence Nucleus • Toolset' });

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`pg_len:${state}`)
        .setPlaceholder('Selecione o tamanho da senha')
        .addOptions([8, 12, 16, 20, 24, 32, 48, 64].map(len => ({
          label: `${len} caracteres`,
          value: len.toString(),
          default: len === length
        })));

      const togglesRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`pg_tg_U:${state}`).setLabel(`ABC [${upper ? 'ON' : 'OFF'}]`).setStyle(upper ? ButtonStyle.Success : ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`pg_tg_L:${state}`).setLabel(`abc [${lower ? 'ON' : 'OFF'}]`).setStyle(lower ? ButtonStyle.Success : ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`pg_tg_N:${state}`).setLabel(`123 [${numbers ? 'ON' : 'OFF'}]`).setStyle(numbers ? ButtonStyle.Success : ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`pg_tg_S:${state}`).setLabel(`#$! [${symbols ? 'ON' : 'OFF'}]`).setStyle(symbols ? ButtonStyle.Success : ButtonStyle.Secondary)
      );

      const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`pg_gen:${state}`).setLabel('⚡ Gerar Acesso').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`pg_copy:${state}`).setLabel('📋 Copiar').setStyle(ButtonStyle.Secondary)
      );

      const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

      await interaction.editReply({ 
        embeds: [embed], 
        components: [row1, togglesRow, actionRow] 
      });
    }

    if (interaction.customId.startsWith('gen_hash_')) {
      const type = interaction.customId.replace('gen_hash_', '');
      let generatedHash = '';
      
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      
      if (type === 'short') {
        for (let i = 0; i < 16; i++) generatedHash += chars.charAt(Math.floor(Math.random() * chars.length));
      } else if (type === 'secure') {
        for (let i = 0; i < 32; i++) generatedHash += chars.charAt(Math.floor(Math.random() * chars.length));
      } else if (type === 'binary') {
        // Gera uma hash longa de 64 caracteres para parecer um binário/hex complexo
        for (let i = 0; i < 64; i++) {
          generatedHash += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }

      const embed = new EmbedBuilder()
        .setTitle('✅ HASH GERADA COM SUCESSO')
        .setDescription(`Sua assinatura de acesso foi gerada. Copie e use o link abaixo para entrar no **Núcleo de Inteligência**.\n\n⚠️ **Aviso:** Esta credencial se autodestruirá em 10 segundos.`)
        .addFields({ name: '🔑 Sua Hash de Acesso', value: `\`\`\`${generatedHash}\`\`\`` })
        .setColor(0x00FF00)
        .setTimestamp();

      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setLabel('ACESSAR NÚCLEO AGORA')
            .setURL(`${config.dashboardUrl}/${generatedHash}`)
            .setStyle(ButtonStyle.Link)
        );

      // 1. REGISTRO IMEDIATO: Salva primeiro para garantir que o acesso funcione mesmo se o Discord falhar
      validHashes.add(generatedHash);
      
      try {
        const TWELVE_HOURS = 12 * 60 * 60 * 1000;
        await query(
          'INSERT INTO access_hashes (hash, expires_at) VALUES ($1, $2)',
          [generatedHash, new Date(Date.now() + TWELVE_HOURS)]
        );
        console.log(`[Segurança] Hash persistida com sucesso: ${generatedHash.substring(0, 8)}...`);
      } catch (err) {
        console.error('❌ Erro crítico ao persistir hash no banco:', err);
      }

      // 2. RESPOSTA AO USUÁRIO: Tenta enviar o link, mas o acesso já está garantido acima
      try {
        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
      } catch (error) {
        console.error('⚠️ Erro ao responder no Discord (Interação expirada), mas a chave foi salva e o dashboard funcionará:', error);
      }

      // 3. LIMPEZA DO CHAT (15 segundos)
      setTimeout(async () => {
        try {
          await interaction.deleteReply().catch(() => {});
        } catch (e) { /* silent */ }
      }, 15000);

      // 4. EXPIRAÇÃO DA SESSÃO (12 horas)
      setTimeout(() => {
        validHashes.delete(generatedHash);
      }, 12 * 60 * 60 * 1000);
    }
  }
}
