import { User } from './user';
import { Chat } from './chats';
import { Message } from '../api/websocket-types';

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

export type AppState = {
  page: Page | null;
  isLoading: boolean;
  loginFormError: string | null;
  user: User | null;
  currentChat: Chat | null;
  currentChatMessages: Array<Message>;
  chatsList: Array<Chat>;
  currentChatUsers: Array<User>;
  currentChatToken: string | null;
  dialogContent: string | null;
  isChatMenuShown: boolean;
};
