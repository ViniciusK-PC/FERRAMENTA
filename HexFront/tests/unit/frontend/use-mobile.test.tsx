import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

const setInnerWidth = (w: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: w });
};

describe('useIsMobile', () => {
  let listeners: Array<() => void> = [];

  beforeEach(() => {
    listeners = [];
    (window.matchMedia as any) = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: (_: string, cb: () => void) => listeners.push(cb),
      removeEventListener: (_: string, cb: () => void) => {
        listeners = listeners.filter((l) => l !== cb);
      },
      dispatchEvent: vi.fn(),
    }));
  });

  it('retorna true quando innerWidth < 768', () => {
    setInnerWidth(500);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('retorna false quando innerWidth >= 768', () => {
    setInnerWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('reage a mudanças de media query', () => {
    setInnerWidth(1200);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      setInnerWidth(400);
      listeners.forEach((cb) => cb());
    });
    expect(result.current).toBe(true);
  });

  it('remove listener no unmount', () => {
    const { unmount } = renderHook(() => useIsMobile());
    expect(listeners.length).toBeGreaterThan(0);
    unmount();
    expect(listeners.length).toBe(0);
  });
});
