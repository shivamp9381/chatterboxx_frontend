import { httpClient } from "../config/AxiosHelper";

export const registerApi = async (username, password) => {
  const response = await httpClient.post("/api/v1/auth/register", {
    username,
    password,
  });
  return response.data; // { token, username }
};

export const loginApi = async (username, password) => {
  const response = await httpClient.post("/api/v1/auth/login", {
    username,
    password,
  });
  return response.data; // { token, username }
};

export const validateTokenApi = async () => {
  const response = await httpClient.get("/api/v1/auth/validate");
  return response.data;
};