import { transformUserDTO, User, UserDTO } from './user';

export type LastChatMessageDTO = {
  user: UserDTO;
  time: string;
  content: string;
};

export type ChatDTO = {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  created_by: number;
  last_message: LastChatMessageDTO | null;
};

export type LastChatMessage = {
  user: User;
  time: string;
  content: string;
};

export type Chat = {
  id: number;
  title: string;
  avatar: string | null;
  unreadCount: number;
  createdBy: number;
  lastMessage: LastChatMessage | null;
};

export type ChatToken = {
  token: string;
};

function transformLastChatMessageDTO(messageDTO: LastChatMessageDTO): LastChatMessage {
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
    lastMessage: chatDTO.last_message ? transformLastChatMessageDTO(chatDTO.last_message) : null,
    createdBy: chatDTO.created_by,
  };
}
