import { AppState, Dispatch, Page } from '../models/app';
import { localStorageUtils, apiHasError } from '../utils';
import { BrowserRouter } from '../core';
import { AuthApi, ChatsApi } from '../api';
import { transformUserDTO } from '../models/user';
import { transformChatDTO } from '../models/chats';

export async function initApp(dispatch: Dispatch<AppState>) {
  const storedPage = localStorageUtils.getCurrentPage();
  if (storedPage) {
    dispatch({ page: storedPage });
  }
  const router = BrowserRouter.getInstance();
  const response = await AuthApi.getInstance().getUserInfo();

  if (!apiHasError(response)) {
    dispatch({ user: transformUserDTO(response) });
    router.go(storedPage || Page.CHAT);
    const chatsResponse = await ChatsApi.getInstance().getChats();
    if (!apiHasError(chatsResponse)) {
      const chats = chatsResponse.map((chatDTO) => transformChatDTO(chatDTO));
      dispatch({ chatsList: chats });
    }
  } else {
    router.go(storedPage || Page.LOGIN);
  }
}
