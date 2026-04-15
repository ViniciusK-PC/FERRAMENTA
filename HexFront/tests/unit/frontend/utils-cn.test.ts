import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn (tailwind class merger)', () => {
  it('concatena classes simples', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('ignora valores falsy', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('aceita objeto com flags booleanas', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500');
  });

  it('aceita arrays aninhados', () => {
    expect(cn(['a', ['b', 'c']])).toBe('a b c');
  });

  it('mescla conflitos tailwind (última classe vence)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('preserva classes não-conflitantes ao mesclar', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('retorna string vazia quando todos os inputs são falsy', () => {
    expect(cn(false, null, undefined, '')).toBe('');
  });
});
