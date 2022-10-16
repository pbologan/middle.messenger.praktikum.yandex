export const BASE_URL = `https://ya-praktikum.tech/api/v2`;

// Auth

export const SIGN_UP = `/auth/signup`;
export const SIGN_IN = `/auth/signin`;
export const GET_USER_INFO = `/auth/user`;
export const LOGOUT = `/auth/logout`;

// Chats

export const CHATS = `/chats`;
export const GET_CHAT_SENT_FILES = (id: string) => `${CHATS}/${id}/files`;
export const ARCHIVE_CHATS = `${CHATS}/archive`;
export const UNARCHIVE_CHAT = `${CHATS}/unarchive`;
export const GET_COMMON_CHAT_WITH_CURRENT_CHAT_USER = (id: string) => `${CHATS}/${id}/common`;
export const GET_CHAT_USERS = (id: string) => `${CHATS}/${id}/users`;
export const GET_NEW_MESSAGES_COUNT = (id: string) => `${CHATS}/new/${id}`;
export const UPLOAD_CHAT_AVATAR = `${CHATS}/avatar`;
export const CHATS_USERS = `${CHATS}/users`;
export const CHATS_TOKEN = (id: string) => `${CHATS}/token/${id}`;
