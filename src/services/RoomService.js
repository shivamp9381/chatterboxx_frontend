import { httpClient } from "../config/AxiosHelper";

// ✅ Fixed: sends JSON { roomId } not plain text
export const createRoomApi = async (roomId) => {
  const response = await httpClient.post(`/api/v1/rooms`, { roomId }, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const joinChatApi = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return response.data;
};

export const getMessagess = async (roomId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};