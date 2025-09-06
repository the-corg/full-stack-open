const loginWith = async (page, username, password) => {
  await page.getByRole('textbox').first().fill(username);
  await page.getByRole('textbox').last().fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new' }).click();
  await page.getByLabel('title').fill(title);
  await page.getByLabel('author').fill(author);
  await page.getByLabel('url').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
  await page.getByText(title + ' ' + author).waitFor();
};

export { loginWith, createBlog };
