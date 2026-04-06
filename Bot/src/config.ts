import dotenv from 'dotenv';
dotenv.config();

const config = {
  token: process.env.DISCORD_TOKEN ?? '',
  triggerChannelId: process.env.TRIGGER_CHANNEL_ID ?? '',
  categoryId: process.env.CATEGORY_ID ?? '',
  channelName: process.env.CHANNEL_NAME ?? '🔊 Canal de {user}',
  userLimit: parseInt(process.env.USER_LIMIT ?? '0', 10),
};

// Validação básica ao iniciar
if (!config.token) {
  console.error('❌  DISCORD_TOKEN não definido no .env!');
  process.exit(1);
}

if (!config.triggerChannelId) {
  console.error('❌  TRIGGER_CHANNEL_ID não definido no .env!');
  process.exit(1);
}

export default config;
