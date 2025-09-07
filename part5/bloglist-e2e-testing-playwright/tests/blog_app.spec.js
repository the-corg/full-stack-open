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

    test('a blog created by the user can be deleted', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'https://testurl');
      await expect(page.getByText('Test Title Test Author')).toBeVisible();

      const blog = page.getByText('Test Title Test Author').locator('..');
      await blog.getByRole('button', { name: 'show' }).click();

      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      await blog.getByRole('button', { name: 'remove' }).click();
      await page
        .getByText('Test Title Test Author')
        .waitFor({ state: 'detached' });

      await expect(page.getByText('Test Title Test Author')).not.toBeVisible();
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

      test('only the user who added the blog can see its remove button', async ({
        page,
        request,
      }) => {
        const secondBlog = page.getByText('Blog 2 Author 2').locator('..');
        await secondBlog.getByRole('button', { name: 'show' }).click();
        await expect(secondBlog.getByText('remove')).toBeVisible();

        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Another User',
            username: 'another',
            password: 'pwd123',
          },
        });

        await page.getByRole('button', { name: 'logout' }).click();

        await loginWith(page, 'another', 'pwd123');
        await expect(page.getByText('Another User logged in')).toBeVisible();

        await secondBlog.getByRole('button', { name: 'show' }).click();
        await expect(secondBlog.getByText('remove')).not.toBeVisible();
      });

      test('the blogs are sorted in descending order by number of likes', async ({
        page,
      }) => {
        const firstBlog = page.getByText('Blog 1 Author 1').locator('..');
        const secondBlog = page.getByText('Blog 2 Author 2').locator('..');
        const thirdBlog = page.getByText('Blog 3 Author 3').locator('..');

        await firstBlog.getByRole('button', { name: 'show' }).click();
        await secondBlog.getByRole('button', { name: 'show' }).click();
        await thirdBlog.getByRole('button', { name: 'show' }).click();

        await expect(firstBlog.getByText('likes 0')).toBeVisible();
        await expect(secondBlog.getByText('likes 0')).toBeVisible();
        await expect(thirdBlog.getByText('likes 0')).toBeVisible();

        await secondBlog.getByRole('button', { name: 'like' }).click();
        await secondBlog.getByText('likes 1').waitFor();

        await expect(
          page
            .getByText('hide')
            .first()
            .locator('../..')
            .getByText('Blog 2 Author 2')
        ).toBeVisible();

        await thirdBlog.getByRole('button', { name: 'like' }).click();
        await thirdBlog.getByText('likes 1').waitFor();
        await thirdBlog.getByRole('button', { name: 'like' }).click();
        await thirdBlog.getByText('likes 2').waitFor();

        await expect(
          page
            .getByText('hide')
            .first()
            .locator('../..')
            .getByText('Blog 2 Author 2')
        ).not.toBeVisible();

        await expect(
          page
            .getByText('hide')
            .first()
            .locator('../..')
            .getByText('Blog 3 Author 3')
        ).toBeVisible();

        await expect(
          page
            .getByText('hide')
            .last()
            .locator('../..')
            .getByText('Blog 1 Author 1')
        ).toBeVisible();

        await firstBlog.getByRole('button', { name: 'like' }).click();
        await firstBlog.getByText('likes 1').waitFor();
        await firstBlog.getByRole('button', { name: 'like' }).click();
        await firstBlog.getByText('likes 2').waitFor();
        await firstBlog.getByRole('button', { name: 'like' }).click();
        await firstBlog.getByText('likes 3').waitFor();

        await expect(
          page
            .getByText('hide')
            .first()
            .locator('../..')
            .getByText('Blog 3 Author 3')
        ).not.toBeVisible();

        await expect(
          page
            .getByText('hide')
            .first()
            .locator('../..')
            .getByText('Blog 1 Author 1')
        ).toBeVisible();

        await expect(
          page
            .getByText('hide')
            .last()
            .locator('../..')
            .getByText('Blog 2 Author 2')
        ).toBeVisible();
      });
    });
  });
});
