export enum WebSocketEvent {
  MESSAGE = 'message',
  OPEN = 'open',
  CLOSE = 'close',
  ERROR = 'error',
}

export enum WebSocketCloseCode {
  NORMAL = 4000,
}

export const WebSocketCloseReason: Record<WebSocketCloseCode, string> = {
  [WebSocketCloseCode.NORMAL]: 'WebSocket closed normal',
};

export type WebSocketCloseType = {
  code: WebSocketCloseCode,
  reason: string
};

export enum WebSocketMessageType {
  USER_CONNECTED = 'user connected',
  PING = 'ping',
  PONG = 'pong',
  GET_OLD = 'get old',
  MESSAGE = 'message',
  FILE = 'file',
}

export type WebSocketMessage = {
  type: WebSocketMessageType,
  content?: string,
};

type FileMessageDTO = {
  id: number,
  user_id: string,
  path: string,
  content_type: string,
  content_size: number,
  upload_date: string,
};

export type MessageType = 'message' | 'file';

export type MessageDTO = {
  id: number,
  time: string,
  type: MessageType,
  user_id: string,
  content: string,
  file?: FileMessageDTO,
};

export type FileMessage = {
  id: number,
  userId: string,
  path: string,
  contentType: string,
  contentSize: number,
  uploadDate: string,
};

export type Message = {
  id: number,
  chatId: number,
  time: string,
  type: MessageType,
  userId: string,
  content: string,
  file?: FileMessage | null,
};

export type OpenConnectionData = {
  userId: number,
  chatId: number,
};

function transformFileMessageDTO(fileMessageDTO: FileMessageDTO): FileMessage {
  return {
    id: fileMessageDTO.id,
    userId: fileMessageDTO.user_id,
    path: fileMessageDTO.path,
    contentType: fileMessageDTO.content_type,
    contentSize: fileMessageDTO.content_size,
    uploadDate: fileMessageDTO.upload_date,
  };
}

export function transformMessageDTO(messageDTO: MessageDTO): Message {
  return {
    id: messageDTO.id,
    time: messageDTO.time,
    type: messageDTO.type,
    userId: messageDTO.user_id,
    content: messageDTO.content,
    file: messageDTO.file ? transformFileMessageDTO(messageDTO.file) : null,
  } as Message;
}

export type PongResponse = {
  type: WebSocketMessageType.PONG,
};

export type UserConnectedResponse = {
  type: WebSocketMessageType.USER_CONNECTED,
  content: string,
};
