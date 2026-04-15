import { vi } from 'vitest';

export const mockInteraction = (overrides: Record<string, any> = {}) => ({
  isChatInputCommand: vi.fn(() => true),
  commandName: 'test',
  reply: vi.fn().mockResolvedValue(undefined),
  editReply: vi.fn().mockResolvedValue(undefined),
  deferReply: vi.fn().mockResolvedValue(undefined),
  followUp: vi.fn().mockResolvedValue(undefined),
  options: {
    getString: vi.fn(),
    getInteger: vi.fn(),
    getBoolean: vi.fn(),
    getUser: vi.fn(),
    getMember: vi.fn(),
    getChannel: vi.fn(),
  },
  user: { id: 'user-1', tag: 'tester#0001' },
  guild: {
    id: 'guild-1',
    members: { fetch: vi.fn() },
    channels: { cache: new Map() },
  },
  member: {
    permissions: { has: vi.fn(() => true) },
    voice: { channel: null, disconnect: vi.fn() },
  },
  ...overrides,
});

export const mockGuildMember = (overrides: Record<string, any> = {}) => ({
  id: 'member-1',
  user: { id: 'member-1', tag: 'member#0001', bot: false },
  voice: { channel: null, disconnect: vi.fn(), setChannel: vi.fn() },
  roles: { cache: new Map(), add: vi.fn(), remove: vi.fn() },
  kick: vi.fn().mockResolvedValue(undefined),
  ban: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

export const mockVoiceState = (overrides: Record<string, any> = {}) => ({
  channelId: null,
  channel: null,
  guild: { id: 'guild-1' },
  member: mockGuildMember(),
  ...overrides,
});
