import { AppState, Page } from '../models/app';

export const initialState: AppState = {
  user: null,
  page: Page.LOGIN,
  isLoading: false,
  loginFormError: null,
  currentChatId: null,
  chatsList: [],
  chatUsers: [],
  dialogContent: null,
};
