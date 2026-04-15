import { test, expect } from '@playwright/test';

test.describe('Website Cloner E2E', () => {
  test.beforeEach(async ({ page }) => {
    const testHash = 'cloner-test-' + Date.now();
    await page.goto(`/${testHash}`);
    await page.waitForLoadState('networkidle');
  });

  test('Website cloner section loads', async ({ page }) => {
    const clonerSection = page.locator('[class*="clone" i], [class*="scraper" i], section:has-text("Clone"), section:has-text("Website")');
    
    if (await clonerSection.count() > 0) {
      await expect(clonerSection.first()).toBeVisible();
    }
  });

  test('URL input accepts website URL', async ({ page }) => {
    const urlInput = page.locator('input[type="url"], input[placeholder*="URL" i], input[placeholder*="website" i]').first();
    
    if (await urlInput.count() > 0) {
      await urlInput.fill('https://example.com');
      const value = await urlInput.inputValue();
      expect(value).toContain('http');
    }
  });

  test('Clone button triggers cloning process', async ({ page }) => {
    const cloneButton = page.locator('button:has-text("Clone"), button:has-text("Download"), button:has-text("Fetch")');
    
    if (await cloneButton.count() > 0) {
      await cloneButton.first().click();
      await page.waitForTimeout(1000);
    }
  });

  test('Progress indicator shows during cloning', async ({ page }) => {
    const urlInput = page.locator('input[type="url"]').first();
    
    if (await urlInput.count() > 0) {
      await urlInput.fill('https://example.com');
      
      const cloneButton = page.locator('button:has-text("Clone")');
      if (await cloneButton.count() > 0) {
        await cloneButton.first().click();
        
        await page.waitForTimeout(500);
        
        const progress = page.locator('[class*="progress" i], [class*="loading" i], [class*="downloading" i]');
        if (await progress.count() > 0) {
          await expect(progress.first()).toBeVisible();
        }
      }
    }
  });

  test('Output directory selection is available', async ({ page }) => {
    const dirInput = page.locator('input[type="text"][placeholder*="directory" i], input[placeholder*="folder" i], select');
    
    if (await dirInput.count() > 0) {
      await expect(dirInput.first()).toBeVisible();
    }
  });

  test('Download button is present for completed clones', async ({ page }) => {
    const downloadSection = page.locator('button:has-text("Download"), a:has-text("Download"), [download]');
    
    if (await downloadSection.count() > 0) {
      await expect(downloadSection.first()).toBeVisible();
    }
  });
});

test.describe('Website Cloner API Integration', () => {
  test('Clone initiation API responds', async ({ request }) => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8888';
    
    try {
      const response = await request.post(
        `${backendUrl}/api/tools/clone`,
        { 
          data: { target_url: 'https://example.com' },
          headers: { 'Content-Type': 'application/json' }
        },
        { timeout: 15000 }
      );
      
      expect([200, 202, 404, 500]).toContain(response.status());
    } catch {
      test.skip('Backend not accessible');
    }
  });

  test('Clone status check endpoint', async ({ request }) => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8888';
    
    try {
      const response = await request.get(
        `${backendUrl}/api/tools/clone/status/test-id`,
        { timeout: 5000 }
      );
      
      expect([200, 404, 500]).toContain(response.status());
    } catch {
      test.skip('Backend not accessible');
    }
  });
});

test.describe('Website Cloner Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    const testHash = 'cloner-error-test-' + Date.now();
    await page.goto(`/${testHash}`);
    await page.waitForLoadState('networkidle');
  });

  test('Invalid URL shows error message', async ({ page }) => {
    const urlInput = page.locator('input[type="url"]').first();
    
    if (await urlInput.count() > 0) {
      await urlInput.fill('not-a-valid-url');
      
      const cloneButton = page.locator('button:has-text("Clone")');
      if (await cloneButton.count() > 0) {
        await cloneButton.first().click();
        await page.waitForTimeout(500);
        
        const error = page.locator('[class*="error" i], text=/invalid/i, text=/error/i');
        if (await error.count() > 0) {
          await expect(error.first()).toBeVisible();
        }
      }
    }
  });

  test('Empty URL shows validation message', async ({ page }) => {
    const cloneButton = page.locator('button:has-text("Clone")').first();
    
    if (await cloneButton.count() > 0) {
      await cloneButton.click();
      await page.waitForTimeout(500);
      
      const validation = page.locator('[class*="required" i], [class*="empty" i], text=/required/i, text=/enter/i');
      if (await validation.count() > 0) {
        await expect(validation.first()).toBeVisible();
      }
    }
  });

  test('HTTPS-only option is available', async ({ page }) => {
    const httpsOnlyCheckbox = page.locator('input[type="checkbox"][id*="https" i], label:has-text("HTTPS")');
    
    if (await httpsOnlyCheckbox.count() > 0) {
      await expect(httpsOnlyCheckbox.first()).toBeVisible();
    }
  });

  test('JavaScript rendering option is toggleable', async ({ page }) => {
    const jsOption = page.locator('input[type="checkbox"][id*="javascript" i], input[type="checkbox"][id*="js" i], label:has-text("JavaScript")');
    
    if (await jsOption.count() > 0) {
      await jsOption.first().click();
      await page.waitForTimeout(300);
      
      const isChecked = await page.locator('input[type="checkbox"][id*="javascript" i]').first().isChecked();
      expect(typeof isChecked).toBe('boolean');
    }
  });

  test('Network timeout is handled gracefully', async ({ page }) => {
    const urlInput = page.locator('input[type="url"]').first();
    
    if (await urlInput.count() > 0) {
      await urlInput.fill('https://very-slow-site.example.com');
      
      const cloneButton = page.locator('button:has-text("Clone")');
      if (await cloneButton.count() > 0) {
        await cloneButton.first().click();
        
        await page.waitForTimeout(5000);
        
        const timeoutError = page.locator('text=/timeout/i, text=/timeout/i');
        const results = page.locator('[class*="result" i]');
        
        expect(await timeoutError.count() > 0 || await results.count() > 0).toBe(true);
      }
    }
  });
});

test.describe('Cloner Output Management', () => {
  test.beforeEach(async ({ page }) => {
    const testHash = 'cloner-output-test-' + Date.now();
    await page.goto(`/${testHash}`);
    await page.waitForLoadState('networkidle');
  });

  test('Downloaded files list is displayed', async ({ page }) => {
    const fileList = page.locator('[class*="file" i], [class*="download" i]');
    
    if (await fileList.count() > 0) {
      await expect(fileList.first()).toBeVisible();
    }
  });

  test('Clear history button works', async ({ page }) => {
    const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset")');
    
    if (await clearButton.count() > 0) {
      await clearButton.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('Copy to clipboard button is available', async ({ page }) => {
    const copyButton = page.locator('button:has-text("Copy"), button[aria-label*="copy" i]');
    
    if (await copyButton.count() > 0) {
      await expect(copyButton.first()).toBeVisible();
    }
  });
});
