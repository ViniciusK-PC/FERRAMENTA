import 'dotenv/config';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { REST, Routes } from 'discord.js';
import BotClient from './client';
import config from './config';
import { createServer } from 'http';

export const validHashes = new Set<string>();

const authServer = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.url?.startsWith('/validate/')) {
     const hash = decodeURIComponent(req.url.replace('/validate/', ''));
     const isValid = validHashes.has(hash);
     res.writeHead(200, { 'Content-Type': 'application/json' });
     res.end(JSON.stringify({ valid: isValid }));
  } else {
     res.writeHead(404);
     res.end();
  }
});

authServer.on('error', (e: any) => {
  if (e.code === 'EADDRINUSE') {
    console.error('⚠️ A porta 3005 está ocupada pelo processo anterior. O bot tentará assumir novamente em 2 segundos...');
    setTimeout(() => {
      authServer.close();
      authServer.listen(3005);
    }, 2000);
  }
});

authServer.listen(3005, () => console.log('🛡️  Servidor de Validação de Hashes rodando na porta 3005'));

// Encerra o servidor de validação graciosamente se o bot fechar (evita erro de porta em uso)
['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach(signal => {
  process.once(signal, () => {
    authServer.close();
    process.exit(0);
  });
});

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

  // Forçar registro para todos os servidores em que o bot está (visto que global pode ser lento)
  client.on('ready', async () => {
    if (!client.user) return;
    
    console.log(`[Loader] ✅ Logado como ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(config.token);
    const commandsData = client.commands.map((cmd) => cmd.data.toJSON());
    
    try {
      // Registro Global
      await rest.put(Routes.applicationCommands(client.user.id), { body: commandsData });
      
      // Registro Instantâneo para os Servidores onde o Bot já está
      const guilds = await client.guilds.fetch();
      for (const [guildId] of guilds) {
        await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: commandsData });
        console.log(`[Loader] ⚡ Comandos registrados instantaneamente para servidor ${guildId}`);
      }
      
      console.log(`[Loader] ✅ Todos os comandos de barra (/) estão ativos!`);
    } catch (error) {
           console.error('[Loader] ❌ Erro ao registrar comandos:', error);
    }
  });
}

main().catch((err) => {
  console.error('❌ Erro fatal ao iniciar:', err);
  process.exit(1);
});
