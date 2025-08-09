import { test, expect } from '@playwright/test';
import { createTestAuth } from '../fixtures/auth';

test.describe('Dispatch load creation', () => {
  test('dispatcher creates load and sees it on board', async ({ page, context }) => {
    const auth = createTestAuth(page, context);
    await auth.loginAsDispatcher();

    await page.goto('/org1/dispatch/loads/new');

    await page.fill('#load_number', 'L-2001');
    await page.click('text=Locations');
    await page.fill('#origin_address', '123 Main St');
    await page.fill('#origin_city', 'Springfield');
    await page.fill('#origin_state', 'IL');
    await page.fill('#origin_zip', '62704');
    await page.fill('#destination_address', '456 Oak Ave');
    await page.fill('#destination_city', 'Shelbyville');
    await page.fill('#destination_state', 'IL');
    await page.fill('#destination_zip', '62565');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/org1\/dispatch$/);
    await expect(page.locator('text=L-2001')).toBeVisible({ timeout: 10000 });
  });
});
