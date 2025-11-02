import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateForm from './CreateForm';

test('<CreateForm /> calls the event handler it received as props with the right details when a new blog is created', async () => {
  const mockAddBlogHandler = vi.fn();

  render(<CreateForm addBlog={mockAddBlogHandler} />);

  const user = userEvent.setup();

  const inputTitle = screen.getByPlaceholderText('title', { exact: false });
  const inputAuthor = screen.getByPlaceholderText('author', { exact: false });
  const inputUrl = screen.getByPlaceholderText('URL', { exact: false });
  const createButton = screen.getByText('create');

  await user.type(inputTitle, 'Test Title');
  await user.type(inputAuthor, 'Test Author');
  await user.type(inputUrl, 'https://testurl');

  await user.click(createButton);

  expect(mockAddBlogHandler.mock.calls).toHaveLength(1);
  expect(mockAddBlogHandler.mock.calls[0][0].title).toBe('Test Title');
  expect(mockAddBlogHandler.mock.calls[0][0].author).toBe('Test Author');
  expect(mockAddBlogHandler.mock.calls[0][0].url).toBe('https://testurl');
});
