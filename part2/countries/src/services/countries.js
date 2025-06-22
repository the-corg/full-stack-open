import axios from "axios";

const url = "https://studies.cs.helsinki.fi/restcountries/api/all";

const getAll = () => axios.get(url).then((response) => response.data);

export default { getAll };
