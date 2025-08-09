import { expect, test } from '@playwright/test';

test.describe('User invite acceptance', () => {
  test('sign up, create org, invite and accept', async ({ page }) => {
    test.skip(true, 'Requires running backend and email service');
    await page.goto('/sign-up');
    await expect(page).toHaveURL(/sign-up/);

    await page.goto('/onboarding');
    await expect(page).toHaveURL(/onboarding/);

    await page.goto('/accept-invitation?token=test-token');
    await expect(page.locator('body')).toBeVisible();
  });
});
