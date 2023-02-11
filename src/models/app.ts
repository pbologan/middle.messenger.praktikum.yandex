import { User } from './user';

export type Dispatch<State> = (
  nextStateOrAction: Partial<State> | Action<State>,
  payload?: any,
) => void;

export type Action<State> = (
  dispatch: Dispatch<State>,
  state: State,
  payload: any,
) => void;

export enum Page {
  LOGIN = 'login',
  SIGN_UP = 'singUp',
  CHAT = 'chat',
  PROFILE = 'profile',
  ERROR = 'error',
  NOT_FOUND = 'notFound',
}

export type AppState = {
  page: Page | null;
  isLoading: boolean;
  loginFormError: string | null;
  user: User | null;
};
