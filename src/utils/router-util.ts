import { BlockClass } from '../core';
import LoginPage from '../pages/login';
import SignupPage from '../pages/sign-up';
import ChatPage from '../pages/chat';
import ProfilePage from '../pages/profile';
import { ErrorPage, NotFoundPage } from '../pages/errors';

export enum Page {
  LOGIN = 'login',
  SIGN_UP = 'singUp',
  CHAT = 'chat',
  PROFILE = 'profile',
  ERROR = 'error',
  NOT_FOUND = 'notFound',
}

const pageMap: Record<Page, BlockClass<any>> = {
  [Page.LOGIN]: LoginPage,
  [Page.SIGN_UP]: SignupPage,
  [Page.CHAT]: ChatPage,
  [Page.PROFILE]: ProfilePage,
  [Page.ERROR]: ErrorPage,
  [Page.NOT_FOUND]: NotFoundPage,
};

export function getPageComponent(page: Page): BlockClass<any> {
  return pageMap[page];
}
