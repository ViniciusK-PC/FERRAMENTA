import 'dotenv/config';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { REST, Routes } from 'discord.js';
import BotClient from './client';
import config from './config';
import { createServer } from 'http';
import { query } from './utils/db';

export const validHashes = new Set<string>();

async function initDatabase() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS access_hashes (
        hash TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      )
    `);
    console.log('📦 Banco de dados inicializado (Tabela access_hashes pronta)');
  } catch (err) {
    console.error('❌ Erro ao inicializar banco de dados:', err);
  }
}

const authServer = createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url?.startsWith('/validate/')) {
     const rawHash = req.url.replace('/validate/', '');
     const hash = decodeURIComponent(rawHash);
     
     // 1. Tenta validar pela memória primeiro (mais rápido)
     let isValid = validHashes.has(hash);
     
     // 2. Se não estiver na memória, tenta no Banco de Dados (Fallback para pós-restart)
     if (!isValid) {
       try {
         const dbResult = await query(
           'SELECT * FROM access_hashes WHERE hash = $1 AND expires_at > CURRENT_TIMESTAMP',
           [hash]
         );
         if ((dbResult as any).rowCount > 0) {
           isValid = true;
           // Recarrega na memória para futuras chamadas de /verify/
           validHashes.add(hash);
           console.log(`[Segurança] [Fallback DB] Hash encontrada no banco e recarregada na memória: "${hash.substring(0, 8)}..."`);
         }
       } catch (dbErr) {
         console.error('❌ Erro ao validar hash no banco de dados:', dbErr);
       }
     }
     
     console.log(`[Segurança] [Validação] Hash Recebida: "${hash}" | Válida: ${isValid}`);
     
     // IMPORTANTE: NÃO deletamos o hash aqui.
     // O hash permanece válido durante toda a sessão até expirar naturalmente
     // ou ser invalidado explicitamente via /invalidate/.
     // Isso garante que o backend Python possa chamar /verify/ múltiplas vezes.

     res.writeHead(200, { 'Content-Type': 'application/json' });
     res.end(JSON.stringify({ valid: isValid }));
  } else if (req.url?.startsWith('/invalidate/')) {
     // Endpoint para logout explícito — invalida o hash da memória e do banco
     const rawHash = req.url.replace('/invalidate/', '');
     const hash = decodeURIComponent(rawHash);
     validHashes.delete(hash);
     query('DELETE FROM access_hashes WHERE hash = $1', [hash]).catch(e => console.error('Erro ao limpar DB:', e));
     console.log(`[Segurança] [Invalidação] Hash removida: "${hash.substring(0, 8)}..."`);
     res.writeHead(200, { 'Content-Type': 'application/json' });
     res.end(JSON.stringify({ invalidated: true }));
  } else if (req.url?.startsWith('/verify/')) {
     const rawHash = req.url.replace('/verify/', '');
     const hash = decodeURIComponent(rawHash);
     
     let isValid = validHashes.has(hash);
     if (!isValid) {
       try {
         const dbResult = await query(
           'SELECT * FROM access_hashes WHERE hash = $1 AND expires_at > CURRENT_TIMESTAMP',
           [hash]
         );
         if ((dbResult as any).rowCount > 0) {
           isValid = true;
           // Recarrega na memória para verificações futuras mais rápidas
           validHashes.add(hash);
         }
       } catch (e) {
         console.error('Erro no verify do DB:', e);
       }
     }
     
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

authServer.listen(3005, '0.0.0.0', () => console.log('🛡️  Servidor de Validação de Hashes rodando em 0.0.0.0:3005'));

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
  await initDatabase();
  await loadEvents();
  await loadCommands();
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

  await client.login(config.token);
}

main().catch((err) => {
  console.error('❌ Erro fatal ao iniciar:', err);
  process.exit(1);
});
