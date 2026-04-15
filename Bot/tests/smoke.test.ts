import { describe, it, expect } from 'vitest';

describe('Bot test suite bootstrap', () => {
  it('test environment is configured', () => {
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.DISCORD_TOKEN).toBeDefined();
  });

  it('can import discord mocks', async () => {
    const { mockInteraction, mockGuildMember, mockVoiceState } = await import('./mocks/discord');
    expect(typeof mockInteraction).toBe('function');
    expect(typeof mockGuildMember).toBe('function');
    expect(typeof mockVoiceState).toBe('function');
  });
});
