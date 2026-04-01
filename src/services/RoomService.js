// import { httpClient } from "../config/AxiosHelper";

// // ✅ Fixed: sends JSON { roomId } not plain text
// export const createRoomApi = async (roomId) => {
//   const response = await httpClient.post(`/api/v1/rooms`, { roomId }, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response.data;
// };

// export const joinChatApi = async (roomId) => {
//   const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
//   return response.data;
// };

// export const getMessagess = async (roomId, size = 50, page = 0) => {
//   const response = await httpClient.get(
//     `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
//   );
//   return response.data;
// };

import { httpClient } from "../config/AxiosHelper";

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

// ✅ Renamed from getMessagess (typo) → getMessages
// ChatPage imports this as getMessagess so keeping both for safety
export const getMessages = async (roomId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};

// Alias so existing imports don't break
export const getMessagess = getMessages;