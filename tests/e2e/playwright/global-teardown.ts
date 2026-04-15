import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('E2E tests completed. Check test-results/ for videos and traces.');
}

export default globalTeardown;
