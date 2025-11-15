const baseUrl = '/api/blogs';
const usersUrl = '/api/users';

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

export const like = async object => {
  const newObject = {
    ...object,
    likes: object.likes + 1,
  };

  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newObject),
  };
  const response = await fetch(`${baseUrl}/${object.id}`, options);
  if (!response.ok) {
    throw new Error('Failed to like blog' + response.status + ': ' + response.statusText);
  }
  return await response.json();
};

export const remove = async object => {
  const options = {
    method: 'DELETE',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
  };
  const response = await fetch(`${baseUrl}/${object.id}`, options);

  if (!response.ok) {
    const r = JSON.parse(await response.text());
    throw new Error('Failed to create blog (' + r.error + ')');
  }
};

export const getUsers = async () => {
  const response = await fetch(usersUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch users' + response.status + ': ' + response.statusText);
  }
  return await response.json();
};
