const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Arnold Schwarzenegger',
        username: 'arnold',
        password: "i'llbeback",
      },
    });

    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    const header = page.getByText('Log in to application');
    await expect(header).toBeVisible();
    const button = page.getByRole('button', { name: 'login' });
    await expect(button).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('arnold');
      await page.getByRole('textbox').last().fill("i'llbeback");
      await page.getByRole('button', { name: 'login' }).click();
      await expect(
        page.getByText('Arnold Schwarzenegger logged in')
      ).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('arnold');
      await page.getByRole('textbox').last().fill('iforgotmypassword');
      await page.getByRole('button', { name: 'login' }).click();

      const errorDiv = page.locator('.error');
      await expect(errorDiv).toContainText('invalid username or password');
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
      await expect(
        page.getByText('Arnold Schwarzenegger logged in')
      ).not.toBeVisible();
    });
  });
});
