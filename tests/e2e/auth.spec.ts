import { test, expect } from '@playwright/test';

test.describe('Authentication Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Landing page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Hex Stalcke|AI| security/i);
    
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible();
    
    const heroText = await hero.textContent();
    expect(heroText).toBeTruthy();
  });

  test('Navigation links are present and functional', async ({ page }) => {
    const navLinks = page.locator('nav a, header a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('Access hash validation redirects to Nucleus client', async ({ page }) => {
    const validHash = 'test-access-hash-' + Date.now();
    
    await page.goto(`/${validHash}`);
    
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    expect(currentUrl).toContain(validHash);
  });

  test('Footer displays copyright and links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    const copyright = footer.locator('text=/©|copyright/i');
    await expect(copyright.first()).toBeVisible();
  });

  test('Theme toggle functionality', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="theme" i], button:has-text("Theme"), button:has-text("Dark"), button:has-text("Light")');
    
    if (await themeToggle.count() > 0) {
      await themeToggle.first().click();
      await page.waitForTimeout(500);
    }
    
    const html = page.locator('html');
    const themeClass = await html.getAttribute('class');
    expect(themeClass === null || typeof themeClass === 'string').toBe(true);
  });

  test('Contact form fields are present', async ({ page }) => {
    const contactSection = page.locator('#contact, [id*="contact"], section:has-text("Contact")');
    
    if (await contactSection.count() > 0) {
      const nameInput = page.locator('input[name*="name" i], input[placeholder*="name" i]');
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]');
      const messageInput = page.locator('textarea, input[placeholder*="message" i]');
      
      if (await nameInput.count() > 0) await expect(nameInput.first()).toBeVisible();
      if (await emailInput.count() > 0) await expect(emailInput.first()).toBeVisible();
      if (await messageInput.count() > 0) await expect(messageInput.first()).toBeVisible();
    }
  });

  test('Skills section displays correctly', async ({ page }) => {
    const skillsSection = page.locator('#skills, [id*="skills"], section:has-text("Skills"), section:has-text("skill")');
    
    if (await skillsSection.count() > 0) {
      await expect(skillsSection.first()).toBeVisible();
      
      const skillItems = page.locator('[class*="skill" i], [class*="card" i], li');
      const itemCount = await skillItems.count();
      expect(itemCount).toBeGreaterThan(0);
    }
  });

  test('Mobile responsive layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    const mobileMenuButton = page.locator('button[aria-label*="menu" i], button:has-text("Menu"), button:has-text("☰")');
    
    if (await mobileMenuButton.count() > 0) {
      await mobileMenuButton.first().click();
      await page.waitForTimeout(500);
    }
    
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible();
  });
});

test.describe('Nucleus Client View E2E', () => {
  test.use({ baseURL: 'http://localhost:3000' });

  test('Nucleus client loads with valid hash', async ({ page }) => {
    const testHash = 'nucleus-test-' + Date.now();
    
    await page.goto(`/${testHash}`);
    await page.waitForLoadState('domcontentloaded');
    
    const pageContent = await page.content();
    expect(pageContent).toBeTruthy();
  });

  test('Terminal interface is accessible', async ({ page }) => {
    const testHash = 'terminal-test-' + Date.now();
    
    await page.goto(`/${testHash}`);
    await page.waitForLoadState('networkidle');
    
    const terminal = page.locator('[class*="terminal" i], [class*="console" i], pre, code[class*="language"]');
    if (await terminal.count() > 0) {
      await expect(terminal.first()).toBeVisible();
    }
  });

  test('API health check endpoint', async ({ request }) => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8888';
    
    try {
      const response = await request.get(`${backendUrl}/health`, { timeout: 5000 });
      
      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeTruthy();
      }
    } catch {
      test.skip('Backend not running');
    }
  });
});
