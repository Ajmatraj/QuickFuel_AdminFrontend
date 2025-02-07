import axios from "axios";

const API_URL = "http://localhost:8000/api/v1";

export const loginUser = async (email, password) => {
  return axios.post(`${API_URL}/users/login`, { email, password });
};
