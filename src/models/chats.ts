import { transformUserDTO, User, UserDTO } from './user';

export type MessageDTO = {
  user: UserDTO;
  time: string;
  content: string;
};

export type ChatDTO = {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  last_message: MessageDTO;
};

export type Message = {
  user: User;
  time: string;
  content: string;
};

export type Chat = {
  id: number;
  title: string;
  avatar: string;
  unreadCount: number;
  lastMessage: Message;
};

export function transformMessageDTO(messageDTO: MessageDTO): Message {
  return {
    user: transformUserDTO(messageDTO.user),
    time: messageDTO.time,
    content: messageDTO.content,
  };
}

export function transformChatDTO(chatDTO: ChatDTO): Chat {
  return {
    id: chatDTO.id,
    title: chatDTO.title,
    avatar: chatDTO.avatar,
    unreadCount: chatDTO.unread_count,
    lastMessage: transformMessageDTO(chatDTO.last_message),
  };
}
