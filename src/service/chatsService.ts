import { AppState, Dispatch } from '../models/app';
import { ChatsApi } from '../api';
import { CreateChatRequest, DeleteChatRequest } from '../api/api-types';
import { apiHasError } from '../utils';
import { transformChatDTO } from '../models/chats';

export class ChatsService {
  private static instance: ChatsService | null = null;

  private constructor() {
    if (ChatsService.instance) {
      throw new Error('Singleton. Use getInstance method');
    }
  }

  public static getInstance() {
    if (!ChatsService.instance) {
      ChatsService.instance = new ChatsService();
    }
    return ChatsService.instance;
  }

  public async createChat(
    dispatch: Dispatch<AppState>,
    data: CreateChatRequest,
  ) {
    dispatch({ isLoading: true });
    try {
      const createChatResponse = await ChatsApi.getInstance().createChat(data);
      if (!apiHasError(createChatResponse)) {
        const getChatsResponse = await ChatsApi.getInstance().getChats();
        if (!apiHasError(getChatsResponse)) {
          const chats = getChatsResponse.map((chat) => transformChatDTO(chat));
          dispatch({ chatsList: chats });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }

  public async deleteChat(
    dispatch: Dispatch<AppState>,
    data: DeleteChatRequest,
  ) {
    dispatch({ isLoading: true });
    try {
      const deleteChatResponse = await ChatsApi.getInstance().deleteChat(data);
      if (!apiHasError(deleteChatResponse)) {
        dispatch({ currentChatId: null });
        const getChatsResponse = await ChatsApi.getInstance().getChats();
        if (!apiHasError(getChatsResponse)) {
          const chats = getChatsResponse.map((chat) => transformChatDTO(chat));
          dispatch({ chatsList: chats });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }
}
