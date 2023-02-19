import { AppState, Dispatch } from '../models/app';
import { ChatsApi, UsersApi } from '../api';
import {
  ChangeChatAvatarData,
  ChatUserActionData,
  ChatUsersRequest,
  CreateChatRequest,
  DeleteChatRequest, GetChatUsersRequest,
} from '../api/api-types';
import { apiHasError } from '../utils';
import { transformChatDTO } from '../models/chats';
import { transformUserDTO } from '../models/user';

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
        dispatch({ currentChat: null });
        dispatch({ currentChatUsers: [] });
        dispatch({ currentChatToken: null });
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

  public async changeChatAvatar(
    dispatch: Dispatch<AppState>,
    data: ChangeChatAvatarData,
  ) {
    dispatch({ isLoading: true });
    try {
      const response = await ChatsApi.getInstance().uploadChatAvatar(data.data);
      if (!apiHasError(response)) {
        dispatch({ currentChat: transformChatDTO(response) });
        const foundChat = data.chatsList.find((chat) => chat.id === data.data.chatId);
        if (foundChat) {
          foundChat.avatar = response.avatar;
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }

  public async addUserToChat(
    dispatch: Dispatch<AppState>,
    data: ChatUserActionData,
  ) {
    dispatch({ isLoading: true });
    try {
      const userResponse = await UsersApi.getInstance().searchUserByLogin(data.userLogin);
      if (!apiHasError(userResponse)) {
        const chatUsers: ChatUsersRequest = {
          users: [userResponse.id],
          chatId: data.chatId,
        };
        const addUserToChatResponse = await ChatsApi.getInstance().addUsersToChat(chatUsers);
        if (!apiHasError(addUserToChatResponse)) {
          dispatch({
            currentChatUsers: [transformUserDTO(userResponse), ...data.currentChatUsers],
          });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }

  public async removeUserFromChat(
    dispatch: Dispatch<AppState>,
    data: ChatUserActionData,
  ) {
    dispatch({ isLoading: true });
    try {
      const userResponse = await UsersApi.getInstance().searchUserByLogin(data.userLogin);
      if (!apiHasError(userResponse)) {
        const chatUsers: ChatUsersRequest = {
          users: [userResponse.id],
          chatId: data.chatId,
        };
        const removeUserFromChatResp = await ChatsApi.getInstance().deleteUsersFromChat(chatUsers);
        if (!apiHasError(removeUserFromChatResp)) {
          dispatch({
            currentChatUsers: data.currentChatUsers.filter((user) => user.id !== userResponse.id),
          });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }

  public async getChatToken(
    dispatch: Dispatch<AppState>,
    chatId: number,
  ) {
    dispatch({ isLoading: true });
    try {
      const response = await ChatsApi.getInstance().getChatToken(chatId);
      if (!apiHasError(response)) {
        dispatch({ currentChatToken: response.token });
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }

  public async getCurrentChatUsers(
    dispatch: Dispatch<AppState>,
    data: GetChatUsersRequest,
  ) {
    dispatch({ isLoading: true });
    try {
      const chatUsersResponse = await ChatsApi.getInstance().getChatUsers(data);
      if (!apiHasError(chatUsersResponse)) {
        console.log('chat users', chatUsersResponse);
        const chatUsers = chatUsersResponse.map((userDTO) => transformUserDTO(userDTO));
        dispatch({ currentChatUsers: chatUsers });
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }
}
