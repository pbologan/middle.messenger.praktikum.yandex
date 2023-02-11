import { ChatDTO } from './chats';
import { UserDTO } from './user';

export type SignUpRequest = {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
};
export type SignUpResponse = {
  id: number;
};

export type SignInRequest = {
  login: string;
  password: string;
};

export type ChatsRequest = {
  offset?: number;
  limit?: number;
  title?: string;
};

export type ChatsResponse = Array<ChatDTO>;

export type CreateChatRequest = {
  title: string;
};

export type DeleteChatRequest = {
  chatId: number;
};

export type DeleteChatResponse = {
  userId: number;
  result: {
    id: number;
    title: string;
    avatar: string;
  }
};

export type GetChatUsersRequest = {
  id: number;
  offset?: number;
  limit?: number;
  name?: string;
  email?: string;
};

export type GetChatUsersResponse = Array<UserDTO>;

export type UploadChatAvatarRequest = {
  chatId: number;
  avatar: File;
};

export type ChatUsersRequest = {
  users: Array<number>,
  chatId: number,
};
