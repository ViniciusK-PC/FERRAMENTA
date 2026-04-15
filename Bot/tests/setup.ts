import { vi } from 'vitest';

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://test:test@localhost:5432/test';
process.env.DISCORD_TOKEN = process.env.DISCORD_TOKEN || 'test-token';

vi.mock('pg', () => {
  const Pool = vi.fn().mockImplementation(() => ({
    query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    connect: vi.fn(),
    end: vi.fn(),
  }));
  return { Pool };
});
