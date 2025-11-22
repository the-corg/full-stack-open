import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const like = async object => {
  const newObject = {
    ...object,
    likes: object.likes + 1,
  };
  const response = await axios.put(`${baseUrl}/${object.id}`, newObject);
  return response.data;
};

const comment = async (id, text) => {
  const comment = { text };
  const response = await axios.post(`${baseUrl}/${id}/comments`, comment);
  return response.data;
};

const remove = async object => {
  const config = {
    headers: { Authorization: token },
  };
  await axios.delete(`${baseUrl}/${object.id}`, config);
};

export default { getAll, create, setToken, like, comment, remove };
