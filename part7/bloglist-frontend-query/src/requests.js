const baseUrl = '/api/blogs';

export const getBlogs = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }
  return await response.json();
};
