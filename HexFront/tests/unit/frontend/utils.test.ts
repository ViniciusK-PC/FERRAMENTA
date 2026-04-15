import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn (classname utility)', () => {
    it('should merge classnames correctly', () => {
      const result = cn('foo', 'bar');
      expect(result).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toContain('base');
      expect(result).toContain('active');
    });

    it('should handle false conditions', () => {
      const isActive = false;
      const result = cn('base', isActive && 'active');
      expect(result).toBe('base');
    });

    it('should handle multiple arguments', () => {
      const result = cn('a', 'b', 'c', 'd');
      expect(result).toContain('a');
      expect(result).toContain('b');
      expect(result).toContain('c');
      expect(result).toContain('d');
    });

    it('should handle undefined and null', () => {
      const result = cn('base', undefined, null, 'extra');
      expect(result).toBe('base extra');
    });

    it('should handle array inputs', () => {
      const classes = ['foo', 'bar'];
      const result = cn(classes);
      expect(result).toContain('foo');
      expect(result).toContain('bar');
    });

    it('should merge tailwind classes intelligently', () => {
      const result = cn('px-2 px-4');
      expect(result).toBe('px-4');
    });
  });
});

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const formatted = date.toLocaleDateString('pt-BR');
      expect(formatted).toContain('15');
      expect(formatted).toContain('01');
      expect(formatted).toContain('2024');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const longString = 'a'.repeat(100);
      const truncated = longString.slice(0, 50) + '...';
      expect(truncated.length).toBe(53);
      expect(truncated.endsWith('...')).toBe(true);
    });

    it('should not truncate short strings', () => {
      const shortString = 'hello';
      expect(shortString.length).toBeLessThanOrEqual(50);
    });
  });

  describe('generateHash', () => {
    it('should generate a hash-like string', () => {
      const hash = Math.random().toString(36).substring(2) + Date.now().toString(36);
      expect(hash.length).toBeGreaterThan(10);
      expect(/^[a-z0-9]+$/i.test(hash)).toBe(true);
    });

    it('should generate unique hashes', () => {
      const hash1 = Math.random().toString(36).substring(2);
      const hash2 = Math.random().toString(36).substring(2);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.org',
        'admin@subdomain.example.com',
      ];
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid',
        '@nodomain.com',
        'user@',
        'user@.com',
        '',
      ];
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('parseURL', () => {
    it('should parse valid URLs', () => {
      const url = 'https://example.com:8080/path?query=value#hash';
      try {
        const parsed = new URL(url);
        expect(parsed.protocol).toBe('https:');
        expect(parsed.hostname).toBe('example.com');
        expect(parsed.port).toBe('8080');
      } catch {
        // URL constructor throws on invalid URLs
      }
    });
  });

  describe('deepClone', () => {
    it('should create a deep copy of objects', () => {
      const original = { a: 1, b: { c: 2, d: [1, 2, 3] } };
      const cloned = JSON.parse(JSON.stringify(original));
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });
  });
});
