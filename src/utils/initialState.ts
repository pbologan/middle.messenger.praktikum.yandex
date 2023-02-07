import { AppState } from '../core/store/types';
import { Page } from './router-util';

export const initialState: AppState = {
  user: null,
  page: Page.LOGIN,
  isLoading: false,
  loginFormError: null,
};
