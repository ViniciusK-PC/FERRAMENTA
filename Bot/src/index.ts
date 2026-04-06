import 'dotenv/config';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { REST, Routes } from 'discord.js';
import BotClient from './client';
import config from './config';

const client = new BotClient();

// ── Carrega todos os eventos da pasta /events ──────────────────────
async function loadEvents(): Promise<void> {
  const eventsPath = join(__dirname, 'events');
  const eventFiles = readdirSync(eventsPath).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const event = require(filePath);

    if (event.once) {
      client.once(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    } else {
      client.on(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    }

    console.log(`[Loader] 📂 Evento carregado: ${event.name}`);
  }
}

// ── Carrega comandos da pasta /commands ──────────────────────────
async function loadCommands(): Promise<void> {
  const commandsPath = join(__dirname, 'commands');
  if (!existsSync(commandsPath)) {
    mkdirSync(commandsPath, { recursive: true });
  }

  const commandFiles = readdirSync(commandsPath).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`[Loader] ⌨️  Comando carregado: ${command.data.name}`);
    }
  }
}

// ── Inicialização ──────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log('🤖 Iniciando bot...');
  await loadEvents();
  await loadCommands();
  await client.login(config.token);

  // Registrar comandos de barra (/) após login
  if (client.user && client.commands.size > 0) {
    const rest = new REST({ version: '10' }).setToken(config.token);
    try {
      const commandsData = client.commands.map((cmd) => cmd.data.toJSON());
      console.log(`[Loader] Atualizando ${commandsData.length} comandos de barra (/) globais...`);
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commandsData }
      );
      console.log(`[Loader] ✅ Comandos globais registrados com sucesso!`);
    } catch (error) {
      console.error('[Loader] ❌ Erro ao registrar comandos:', error);
    }
  }
}

main().catch((err) => {
  console.error('❌ Erro fatal ao iniciar:', err);
  process.exit(1);
});
