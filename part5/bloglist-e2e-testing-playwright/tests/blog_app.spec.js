const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

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
      await loginWith(page, 'arnold', "i'llbeback");
      await expect(
        page.getByText('Arnold Schwarzenegger logged in')
      ).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'arnold', 'iforgotmypassword');

      const errorDiv = page.locator('.error');
      await expect(errorDiv).toContainText('invalid username or password');
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
      await expect(
        page.getByText('Arnold Schwarzenegger logged in')
      ).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'arnold', "i'llbeback");
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'https://testurl');
      await expect(page.getByText('Test Title Test Author')).toBeVisible();
    });

    describe('and several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Blog 1', 'Author 1', 'https://url1');
        await createBlog(page, 'Blog 2', 'Author 2', 'https://url2');
        await createBlog(page, 'Blog 3', 'Author 3', 'https://url3');
      });

      test('one of those can be liked', async ({ page }) => {
        const secondBlog = page.getByText('Blog 2 Author 2').locator('..');
        await secondBlog.getByRole('button', { name: 'show' }).click();
        await expect(secondBlog.getByText('likes 0')).toBeVisible();

        await secondBlog.getByRole('button', { name: 'like' }).click();
        await expect(secondBlog.getByText('likes 1')).toBeVisible();
      });
    });
  });
});
