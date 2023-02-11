import { ContentType, HTTPTransport } from '../utils/http-transport';
import {
  BASE_URL,
  CHATS, CHATS_USERS,
  getChatUsersUrl,
  getNewMessagesCountUrl,
  UPLOAD_CHAT_AVATAR,
} from './urls';
import {
  ChatUsersRequest,
  ChatsRequest,
  ChatsResponse,
  CreateChatRequest,
  DeleteChatRequest,
  DeleteChatResponse, GetChatUsersRequest, GetChatUsersResponse, UploadChatAvatarRequest,
} from '../models/api-types';
import { APIError } from '../models/error';
import { ChatDTO } from '../models/chats';

export class ChatsApi {
  private static instance: ChatsApi | null = null;

  private readonly httpClient: HTTPTransport;

  constructor() {
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
    return this.httpClient.post<APIError>(CHATS, { data: chatData });
  }

  public deleteChat(chatData: DeleteChatRequest) {
    return this.httpClient.delete<DeleteChatResponse | APIError>(CHATS, { data: chatData });
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
      headers: { 'Content-Type': ContentType.FORM_DATA },
    });
  }

  public addUsersToChat(data: ChatUsersRequest) {
    return this.httpClient.put<APIError>(CHATS_USERS, { data });
  }

  public deleteUsersFromChat(data: ChatUsersRequest) {
    return this.httpClient.delete<APIError>(CHATS_USERS, { data });
  }
}