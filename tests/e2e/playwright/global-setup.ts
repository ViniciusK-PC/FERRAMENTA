import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8888';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const botUrl = process.env.BOT_URL || 'http://localhost:3005';

  console.log('Checking backend health...');
  try {
    const response = await page.request.get(`${backendUrl}/health`);
    if (response.ok()) {
      console.log('Backend is healthy');
    } else {
      console.warn('Backend returned non-ok status:', response.status());
    }
  } catch (error) {
    console.warn('Backend is not running:', error);
  }

  console.log('Checking frontend...');
  try {
    await page.goto(frontendUrl, { timeout: 10000 });
    console.log('Frontend is accessible');
  } catch (error) {
    console.warn('Frontend is not accessible:', error);
  }

  await browser.close();
}

export default globalSetup;
