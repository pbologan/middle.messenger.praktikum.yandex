import { WebSocketUrlData } from './api-types';

export const BASE_URL = `https://ya-praktikum.tech/api/v2`;

// Auth

export const SIGN_UP = `/auth/signup`;
export const SIGN_IN = `/auth/signin`;
export const GET_USER_INFO = `/auth/user`;
export const LOGOUT = `/auth/logout`;

// Chats

export const CHATS = `/chats`;
export const getChatUsersUrl = (id: number) => `${CHATS}/${id}/users`;
export const getNewMessagesCountUrl = (id: number) => `${CHATS}/new/${id}`;
export const UPLOAD_CHAT_AVATAR = `${CHATS}/avatar`;
export const CHATS_USERS = `${CHATS}/users`;
export const CHATS_TOKEN = `${CHATS}/token`;

export const RESOURCES = '/resources';

// Users

export const USER = '/user';
export const USER_PROFILE = `${USER}/profile`;
export const USER_PROFILE_AVATAR = `${USER_PROFILE}/avatar`;
export const USER_PASSWORD = `${USER}/password`;
export const USER_SEARCH = `${USER}/search`;

export const getWebSocketUrl = ({
  userId,
  chatId,
  token,
}: WebSocketUrlData) => {
  return `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;
};
