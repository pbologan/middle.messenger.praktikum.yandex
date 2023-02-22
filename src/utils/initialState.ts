import { AppState, Page } from '../models/app';

export const initialState: AppState = {
  user: null,
  page: Page.LOGIN,
  isLoading: false,
  loginFormError: null,
  currentChat: null,
  currentChatMessages: [],
  chatsList: [],
  currentChatUsers: [],
  dialogContent: null,
  isChatMenuShown: false,
  currentChatToken: null,
};
