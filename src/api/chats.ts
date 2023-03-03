import {
  BASE_URL,
  CHATS, CHATS_TOKEN, CHATS_USERS,
  getChatUsersUrl,
  getNewMessagesCountUrl, RESOURCES,
  UPLOAD_CHAT_AVATAR,
} from './urls';
import {
  ChatUsersRequest,
  ChatsRequest,
  ChatsResponse,
  CreateChatRequest,
  DeleteChatRequest,
  DeleteChatResponse,
  GetChatUsersRequest,
  GetChatUsersResponse,
  UploadChatAvatarRequest, ResourceResponse,
} from './api-types';
import { APIError } from '../models/error';
import { ChatDTO, ChatToken } from '../models/chats';
import { ContentType, Header, HTTPTransport } from './http-transport';

export class ChatsApi {
  private static instance: ChatsApi | null = null;

  private readonly httpClient: HTTPTransport;

  private constructor() {
    this.httpClient = new HTTPTransport(BASE_URL);
  }

  public static getInstance(): ChatsApi {
    if (!ChatsApi.instance) {
      ChatsApi.instance = new ChatsApi();
    }
    return ChatsApi.instance;
  }

  public getChats(chatsRequest?: ChatsRequest) {
    const options = { data: { ...chatsRequest } } || {};
    return this.httpClient.get<ChatsResponse | APIError>(CHATS, options);
  }

  public createChat(chatData: CreateChatRequest) {
    return this.httpClient.post<string | APIError>(CHATS, {
      data: chatData,
      headers: {
        [Header.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
    });
  }

  public deleteChat(chatData: DeleteChatRequest) {
    return this.httpClient.delete<DeleteChatResponse | APIError>(CHATS, {
      data: chatData,
      headers: {
        [Header.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
    });
  }

  public getChatUsers(chatData: GetChatUsersRequest) {
    const {
      offset, limit, name, email,
    } = chatData;
    return this.httpClient.get<GetChatUsersResponse | APIError>(
      getChatUsersUrl(chatData.id),
      {
        data: {
          offset, limit, name, email,
        },
      },
    );
  }

  public getChatNewMessagesCount(chatId: number) {
    return this.httpClient.get<{ unread_count: number } | APIError>(getNewMessagesCountUrl(chatId));
  }

  public uploadChatAvatar(data: UploadChatAvatarRequest) {
    const formData = new FormData();
    formData.append('chatId', String(data.chatId));
    formData.append('avatar', data.avatar);
    return this.httpClient.put<ChatDTO | APIError>(UPLOAD_CHAT_AVATAR, {
      data: formData,
      headers: {},
    });
  }

  public addUsersToChat(data: ChatUsersRequest) {
    return this.httpClient.put<string | APIError>(CHATS_USERS, {
      data,
      headers: {
        [Header.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
    });
  }

  public deleteUsersFromChat(data: ChatUsersRequest) {
    return this.httpClient.delete<string | APIError>(CHATS_USERS, {
      data,
      headers: {
        [Header.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
    });
  }

  public getChatToken(chatId: number) {
    return this.httpClient.post<ChatToken | APIError>(`${CHATS_TOKEN}/${chatId}`);
  }

  public sendFile(file: File) {
    const formData = new FormData();
    formData.append('resource', file);
    return this.httpClient.post<ResourceResponse | APIError>(RESOURCES, {
      data: formData,
      headers: {},
    });
  }
}
