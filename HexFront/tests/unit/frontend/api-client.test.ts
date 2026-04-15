import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchFromApi, checkHealth, launchAnalysis, API_BASE_URL } from '@/lib/api-client';

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockReset();
  });

  describe('API_BASE_URL', () => {
    it('should be defined', () => {
      expect(API_BASE_URL).toBeDefined();
      expect(API_BASE_URL).toContain('http');
    });
  });

  describe('fetchFromApi', () => {
    it('should fetch data from API successfully', async () => {
      const mockData = { status: 'success', data: { id: 1 } };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchFromApi('/test-endpoint');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should include access hash in headers when provided', async () => {
      const mockData = { status: 'success' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const accessHash = 'test-hash-123';
      await fetchFromApi('/test', {}, accessHash);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Access-Hash': accessHash,
          }),
        })
      );
    });

    it('should throw error on non-ok response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
        json: () => Promise.resolve({ error: 'Resource not found' }),
      });

      await expect(fetchFromApi('/not-found')).rejects.toThrow('Resource not found');
    });

    it('should handle response without error body', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Server Error',
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(fetchFromApi('/error')).rejects.toThrow('API Error: Server Error');
    });

    it('should merge custom headers with defaults', async () => {
      const mockData = { status: 'success' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      await fetchFromApi('/test', {
        headers: { 'X-Custom-Header': 'value' },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Custom-Header': 'value',
          }),
        })
      );
    });

    it('should pass through request options', async () => {
      const mockData = { status: 'success' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      await fetchFromApi('/test', {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
        credentials: 'include',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ data: 'test' }),
          credentials: 'include',
        })
      );
    });
  });

  describe('checkHealth', () => {
    it('should call /health endpoint', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'healthy' }),
      });

      await checkHealth();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/health'),
        expect.any(Object)
      );
    });

    it('should return health status data', async () => {
      const healthData = { status: 'healthy', uptime: 3600 };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(healthData),
      });

      const result = await checkHealth();
      expect(result).toEqual(healthData);
    });
  });

  describe('launchAnalysis', () => {
    it('should POST to analyze-target endpoint', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ job_id: '123' }),
      });

      await launchAnalysis('example.com', 'scan');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/intelligence/analyze-target'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should include target and analysis_type in body', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ job_id: '123' }),
      });

      await launchAnalysis('example.com', 'port_scan');

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      expect(body.target).toBe('example.com');
      expect(body.analysis_type).toBe('port_scan');
    });

    it('should pass access hash when provided', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ job_id: '123' }),
      });

      const accessHash = 'secure-hash';
      await launchAnalysis('example.com', 'scan', accessHash);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Access-Hash': accessHash,
          }),
        })
      );
    });
  });
});
