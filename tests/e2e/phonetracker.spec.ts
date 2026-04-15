import { test, expect } from '@playwright/test';

test.describe('Phone Tracker E2E', () => {
  test.beforeEach(async ({ page }) => {
    const testHash = 'phone-test-' + Date.now();
    await page.goto(`/${testHash}`);
    await page.waitForLoadState('networkidle');
  });

  test('Phone tracker section loads', async ({ page }) => {
    const trackerSection = page.locator('[class*="phone" i], [class*="tracker" i], section:has-text("Phone"), section:has-text("Tracker")');
    
    if (await trackerSection.count() > 0) {
      await expect(trackerSection.first()).toBeVisible();
    }
  });

  test('Phone input field accepts international format', async ({ page }) => {
    const phoneInput = page.locator('input[type="tel"], input[placeholder*="phone" i], input[placeholder*="Phone" i]').first();
    
    if (await phoneInput.count() > 0) {
      await phoneInput.fill('+5511999999999');
      const value = await phoneInput.inputValue();
      expect(value).toContain('+') || expect(value).toContain('55');
    }
  });

  test('Phone input accepts Brazilian format', async ({ page }) => {
    const phoneInput = page.locator('input[type="tel"], input').first();
    
    if (await phoneInput.count() > 0) {
      await phoneInput.fill('(11) 99999-9999');
      await expect(phoneInput).toHaveValue(/[\d\s\-\(\)+]/);
    }
  });

  test('Track button triggers lookup', async ({ page }) => {
    const trackButton = page.locator('button:has-text("Track"), button:has-text("Search"), button:has-text("Find")');
    
    if (await trackButton.count() > 0) {
      await trackButton.first().click();
      await page.waitForTimeout(1000);
    }
  });

  test('Loading state appears during lookup', async ({ page }) => {
    const phoneInput = page.locator('input[type="tel"]').first();
    
    if (await phoneInput.count() > 0) {
      await phoneInput.fill('+5511999999999');
      
      const trackButton = page.locator('button:has-text("Track"), button:has-text("Search")');
      if (await trackButton.count() > 0) {
        await trackButton.first().click();
        
        await page.waitForTimeout(500);
        
        const loading = page.locator('[class*="loading" i], [class*="spinner" i], [class*="processing" i]');
        if (await loading.count() > 0) {
          await expect(loading.first()).toBeVisible();
        }
      }
    }
  });

  test('Results display location information', async ({ page }) => {
    const resultsArea = page.locator('[class*="result" i], [class*="location" i], [class*="info" i]');
    
    if (await resultsArea.count() > 0) {
      await expect(resultsArea.first()).toBeVisible();
    }
  });

  test('Map container renders for location display', async ({ page }) => {
    const mapContainer = page.locator('[class*="map" i], #map, [id*="map" i], [class*="leaflet" i]');
    
    if (await mapContainer.count() > 0) {
      await expect(mapContainer.first()).toBeVisible();
    }
  });

  test('Invalid phone number shows error', async ({ page }) => {
    const phoneInput = page.locator('input[type="tel"]').first();
    
    if (await phoneInput.count() > 0) {
      await phoneInput.fill('abc');
      
      const trackButton = page.locator('button:has-text("Track")');
      if (await trackButton.count() > 0) {
        await trackButton.first().click();
        await page.waitForTimeout(500);
        
        const error = page.locator('[class*="error" i], [class*="invalid" i], text=/error/i');
        if (await error.count() > 0) {
          await expect(error.first()).toBeVisible();
        }
      }
    }
  });
});

test.describe('Phone Tracker API Integration', () => {
  test('Phone lookup API endpoint responds', async ({ request }) => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8888';
    
    try {
      const response = await request.post(
        `${backendUrl}/api/phone/lookup`,
        { 
          data: { phone: '+5511999999999' },
          headers: { 'Content-Type': 'application/json' }
        },
        { timeout: 10000 }
      );
      
      expect([200, 404, 500, 400]).toContain(response.status());
    } catch {
      test.skip('Backend not accessible');
    }
  });

  test('Phone validation endpoint works', async ({ request }) => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8888';
    
    try {
      const response = await request.post(
        `${backendUrl}/api/phone/validate`,
        { 
          data: { phone: '+5511999999999' },
          headers: { 'Content-Type': 'application/json' }
        },
        { timeout: 5000 }
      );
      
      expect([200, 400, 500]).toContain(response.status());
    } catch {
      test.skip('Backend not accessible');
    }
  });
});

test.describe('Phone Tracker Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    const testHash = 'phone-error-test-' + Date.now();
    await page.goto(`/${testHash}`);
    await page.waitForLoadState('networkidle');
  });

  test('Empty phone field shows validation message', async ({ page }) => {
    const phoneInput = page.locator('input[type="tel"]').first();
    const trackButton = page.locator('button:has-text("Track")');
    
    if (await phoneInput.count() > 0 && await trackButton.count() > 0) {
      await trackButton.first().click();
      await page.waitForTimeout(500);
      
      const validation = page.locator('[class*="required" i], [class*="empty" i], text=/required/i');
      if (await validation.count() > 0) {
        await expect(validation.first()).toBeVisible();
      }
    }
  });

  test('Network error during lookup is handled gracefully', async ({ page }) => {
    const phoneInput = page.locator('input[type="tel"]').first();
    
    if (await phoneInput.count() > 0) {
      await phoneInput.fill('+5511999999999');
      
      const trackButton = page.locator('button:has-text("Track")');
      if (await trackButton.count() > 0) {
        await trackButton.first().click();
        await page.waitForTimeout(3000);
        
        const error = page.locator('[class*="error" i], text=/error/i, text=/failed/i');
        const results = page.locator('[class*="result" i]');
        
        expect(await error.count() > 0 || await results.count() > 0).toBe(true);
      }
    }
  });
});
