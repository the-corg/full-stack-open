import { render, screen } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  beforeEach(() => {
    const blog = {
      title: 'Component testing with react-testing-library',
      author: 'Example Author',
      url: 'https:/example.com',
    };

    render(<Blog blog={blog} />);
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
});
