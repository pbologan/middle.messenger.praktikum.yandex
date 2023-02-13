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
  LOGIN = '/login',
  SIGN_UP = '/singup',
  CHAT = '/chat',
  PROFILE = '/profile',
  ERROR = '/error',
  NOT_FOUND = '/notfound',
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
