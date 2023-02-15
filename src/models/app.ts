import { User } from './user';

export type Dispatch<State> = (
  nextStateOrAction: Partial<State> | Action<State>,
  payload?: any,
) => void;

export type Action<State> = (
  dispatch: Dispatch<State>,
  payload?: any,
) => void;

export enum Page {
  ANY_PATH = '*',
  LOGIN = '/',
  SIGN_UP = '/sing-up',
  CHAT = '/messenger',
  PROFILE = '/settings',
  ERROR = '/error',
  NOT_FOUND = '/not-found',
}

export type CurrentPage = {
  currentPage: Page;
};

export type AppState = {
  page: Page | null;
  isLoading: boolean;
  loginFormError: string | null;
  user: User | null;
};
