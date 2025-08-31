import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  const mockLikeHandler = vi.fn();

  beforeEach(() => {
    const blog = {
      title: 'Component testing with react-testing-library',
      author: 'Example Author',
      url: 'https:/example.com',
    };

    render(<Blog blog={blog} likeBlog={mockLikeHandler} />);
  });

  test('renders the title by default', () => {
    const element = screen.getByText(
      'Component testing with react-testing-library',
      { exact: false }
    );

    expect(element).toBeDefined();
  });

  test('renders the author by default', () => {
    const element = screen.getByText('Example Author', { exact: false });

    expect(element).toBeDefined();
  });

  test('does not render the URL by default', () => {
    const element = screen.getByText('https:/example.com', { exact: false });

    expect(element).not.toBeVisible();
  });

  test('does not render the likes by default', () => {
    const element = screen.getByText('likes', { exact: false });

    expect(element).not.toBeVisible();
  });

  test('after the "show" button is clicked, the URL is displayed', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('show');
    await user.click(button);

    const element = screen.getByText('https:/example.com', { exact: false });
    expect(element).toBeVisible();
  });

  test('after the "show" button is clicked, the likes are displayed', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('show');
    await user.click(button);

    const element = screen.getByText('likes', { exact: false });
    expect(element).toBeVisible();
  });

  test('if the "like" button is clicked twice, the corresponding event handler is called twice', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('like');
    await user.click(button);
    await user.click(button);

    expect(mockLikeHandler.mock.calls).toHaveLength(2);
  });
});
