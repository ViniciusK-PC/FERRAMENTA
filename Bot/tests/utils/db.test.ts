import { describe, it, expect, vi } from 'vitest';

describe('db util', () => {
  it('exporta query e default pool', async () => {
    const db = await import('../../src/utils/db');
    expect(typeof db.query).toBe('function');
    expect(db.default).toBeDefined();
  });

  it('query delega para pool.query com text e params', async () => {
    const db = await import('../../src/utils/db');
    const spy = vi.spyOn(db.default, 'query');
    await db.query('SELECT 1', ['a']);
    expect(spy).toHaveBeenCalledWith('SELECT 1', ['a']);
    spy.mockRestore();
  });

  it('query funciona sem params', async () => {
    const db = await import('../../src/utils/db');
    const spy = vi.spyOn(db.default, 'query');
    await db.query('SELECT NOW()');
    expect(spy).toHaveBeenCalledWith('SELECT NOW()', undefined);
    spy.mockRestore();
  });
});
