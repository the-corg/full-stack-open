import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const like = async object => {
  const newObject = {
    ...object,
    likes: object.likes + 1,
  };
  const response = await axios.put(`${baseUrl}/${object.id}`, newObject);
  return response.data;
};

const remove = async object => {
  const config = {
    headers: { Authorization: token },
  };

  await axios.delete(`${baseUrl}/${object.id}`, config);
};

export default { setToken, like, remove };
