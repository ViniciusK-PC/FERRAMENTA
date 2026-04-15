import { describe, it, expect } from 'vitest';
import { generatePassword, PasswordOptions } from '../../src/utils/generatePassword';

const opts = (o: Partial<PasswordOptions> = {}): PasswordOptions => ({
  length: 16,
  upper: true,
  lower: true,
  numbers: true,
  symbols: true,
  ...o,
});

describe('generatePassword', () => {
  it('respeita o comprimento solicitado', () => {
    [1, 8, 16, 32, 64].forEach((length) => {
      expect(generatePassword(opts({ length })).length).toBe(length);
    });
  });

  it('retorna string vazia para length 0', () => {
    expect(generatePassword(opts({ length: 0 }))).toBe('');
  });

  it('contém apenas caracteres uppercase quando só upper está ativo', () => {
    const pwd = generatePassword(opts({ length: 64, upper: true, lower: false, numbers: false, symbols: false }));
    expect(pwd).toMatch(/^[A-Z]+$/);
  });

  it('contém apenas caracteres lowercase quando só lower está ativo', () => {
    const pwd = generatePassword(opts({ length: 64, upper: false, lower: true, numbers: false, symbols: false }));
    expect(pwd).toMatch(/^[a-z]+$/);
  });

  it('contém apenas números quando só numbers está ativo', () => {
    const pwd = generatePassword(opts({ length: 64, upper: false, lower: false, numbers: true, symbols: false }));
    expect(pwd).toMatch(/^[0-9]+$/);
  });

  it('contém apenas símbolos quando só symbols está ativo', () => {
    const pwd = generatePassword(opts({ length: 64, upper: false, lower: false, numbers: false, symbols: true }));
    expect(pwd).toMatch(/^[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/);
  });

  it('usa fallback (lower+numbers) quando nenhum conjunto é selecionado', () => {
    const pwd = generatePassword(opts({ length: 128, upper: false, lower: false, numbers: false, symbols: false }));
    expect(pwd).toMatch(/^[a-z0-9]+$/);
  });

  it('gera senhas diferentes em chamadas consecutivas (entropia mínima)', () => {
    const samples = new Set<string>();
    for (let i = 0; i < 20; i++) samples.add(generatePassword(opts({ length: 32 })));
    expect(samples.size).toBeGreaterThan(15);
  });

  it('combina todos os charsets quando todas as flags estão ativas', () => {
    const pwd = generatePassword(opts({ length: 500 }));
    expect(pwd).toMatch(/[A-Z]/);
    expect(pwd).toMatch(/[a-z]/);
    expect(pwd).toMatch(/[0-9]/);
    expect(pwd).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/);
  });
});
