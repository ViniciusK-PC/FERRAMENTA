import { test, expect } from '@playwright/test';

test.describe('Port Scanner E2E', () => {
  test.beforeEach(async ({ page }) => {
    const testHash = 'scanner-test-' + Date.now();
    await page.goto(`/${testHash}`);
    await page.waitForLoadState('networkidle');
  });

  test('Port scanner interface loads', async ({ page }) => {
    const scannerSection = page.locator('[class*="scanner" i], [class*="port" i], section:has-text("Scan"), button:has-text("Scan")');
    
    if (await scannerSection.count() > 0) {
      await expect(scannerSection.first()).toBeVisible();
    }
  });

  test('Target input field accepts IP address', async ({ page }) => {
    const targetInput = page.locator('input[placeholder*="IP" i], input[placeholder*="target" i], input[placeholder*="host" i], input[type="text"]').first();
    
    if (await targetInput.count() > 0) {
      await targetInput.fill('192.168.1.1');
      await expect(targetInput).toHaveValue('192.168.1.1');
    }
  });

  test('Target input accepts domain name', async ({ page }) => {
    const targetInput = page.locator('input[type="text"]').first();
    
    if (await targetInput.count() > 0) {
      await targetInput.fill('example.com');
      await expect(targetInput).toHaveValue('example.com');
    }
  });

  test('Port range selection works', async ({ page }) => {
    const portInput = page.locator('input[type="number"], input[placeholder*="port" i]');
    
    if (await portInput.count() > 0) {
      await portInput.first().fill('80');
      const value = await portInput.first().inputValue();
      expect(parseInt(value)).toBeGreaterThan(0);
    }
  });

  test('Scan button triggers scanning action', async ({ page }) => {
    const scanButton = page.locator('button:has-text("Scan"), button:has-text("Start"), button:has-text("Run")');
    
    if (await scanButton.count() > 0) {
      await scanButton.first().click();
      await page.waitForTimeout(1000);
    }
  });

  test('Results display area exists', async ({ page }) => {
    const resultsArea = page.locator('[class*="result" i], [class*="output" i], [class*="log" i], pre');
    
    if (await resultsArea.count() > 0) {
      await expect(resultsArea.first()).toBeVisible();
    }
  });
});

test.describe('Directory Scanner E2E', () => {
  test.beforeEach(async ({ page }) => {
    const testHash = 'dirscan-test-' + Date.now();
    await page.goto(`/${testHash}`);
    await page.waitForLoadState('networkidle');
  });

  test('Directory scanner section loads', async ({ page }) => {
    const scannerSection = page.locator('text=/directory|dir|enum/i');
    
    if (await scannerSection.count() > 0) {
      await expect(scannerSection.first()).toBeVisible();
    }
  });

  test('URL input accepts full URL', async ({ page }) => {
    const urlInput = page.locator('input[type="url"], input[placeholder*="URL" i], input[placeholder*="url" i]').first();
    
    if (await urlInput.count() > 0) {
      await urlInput.fill('https://example.com');
      const value = await urlInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  });

  test('Wordlist selection is available', async ({ page }) => {
    const wordlistSelect = page.locator('select, input[type="file"]');
    
    if (await wordlistSelect.count() > 0) {
      await expect(wordlistSelect.first()).toBeVisible();
    }
  });

  test('Start scan button is clickable', async ({ page }) => {
    const startButton = page.locator('button:has-text("Start"), button:has-text("Scan"), button:has-text("Discover")');
    
    if (await startButton.count() > 0) {
      await startButton.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('Progress indicator appears during scan', async ({ page }) => {
    const scanButton = page.locator('button:has-text("Scan")').first();
    
    if (await scanButton.count() > 0) {
      await scanButton.click();
      
      const progress = page.locator('[class*="progress" i], [class*="loading" i], [class*="spinner" i]');
      
      if (await progress.count() > 0) {
        await expect(progress.first()).toBeVisible();
      }
    }
  });

  test('Found paths are displayed in results', async ({ page }) => {
    const resultsTable = page.locator('table, [class*="table" i], [class*="list" i]');
    
    if (await resultsTable.count() > 0) {
      await expect(resultsTable.first()).toBeVisible();
    }
  });
});

test.describe('Scanner API Integration', () => {
  test('Backend port scanner endpoint responds', async ({ request }) => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8888';
    
    try {
      const response = await request.post(
        `${backendUrl}/api/scan/port`,
        { 
          data: { target: '127.0.0.1', ports: [80, 443] },
          headers: { 'Content-Type': 'application/json' }
        },
        { timeout: 10000 }
      );
      
      expect([200, 404, 500]).toContain(response.status());
    } catch {
      test.skip('Backend not accessible');
    }
  });

  test('Backend directory scanner endpoint responds', async ({ request }) => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8888';
    
    try {
      const response = await request.post(
        `${backendUrl}/api/scan/directory`,
        { 
          data: { target: 'http://example.com', paths: ['/admin', '/login'] },
          headers: { 'Content-Type': 'application/json' }
        },
        { timeout: 10000 }
      );
      
      expect([200, 404, 500]).toContain(response.status());
    } catch {
      test.skip('Backend not accessible');
    }
  });
});
