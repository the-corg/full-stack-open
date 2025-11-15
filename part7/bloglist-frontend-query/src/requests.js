const baseUrl = '/api/blogs';

let token = null;
export const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

export const getBlogs = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch blogs' + response.status + ': ' + response.statusText);
  }
  return await response.json();
};

export const createBlog = async newBlog => {
  const options = {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify(newBlog),
  };
  const response = await fetch(baseUrl, options);

  if (response.ok) return await response.json();

  const r = JSON.parse(await response.text());
  throw new Error('Failed to create blog (' + r.error + ')');
};
