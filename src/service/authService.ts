import { AuthApi, ChatsApi } from '../api';
import { SignInRequest, SignUpRequest } from '../api/api-types';
import { AppState, Dispatch, Page } from '../models/app';
import { BrowserRouter } from '../core';
import { apiHasError } from '../utils';
import { transformUserDTO } from '../models/user';
import { transformChatDTO } from '../models/chats';

export class AuthService {
  private static instance: AuthService | null = null;

  private constructor() {
    if (AuthService.instance) {
      throw new Error('Singleton. Use getInstance method');
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(
    dispatch: Dispatch<AppState>,
    userData: SignInRequest,
  ) {
    try {
      dispatch({ isLoading: true });
      const signInResponse = await AuthApi.getInstance().signIn(userData);
      if (!apiHasError(signInResponse)) {
        BrowserRouter.getInstance().go(Page.CHAT);
        const userInfoResponse = await AuthApi.getInstance().getUserInfo();
        if (!apiHasError(userInfoResponse)) {
          dispatch({ user: transformUserDTO(userInfoResponse) });
        }
        const chatsResponse = await ChatsApi.getInstance().getChats();
        if (!apiHasError(chatsResponse)) {
          const chats = chatsResponse.map((chatDTO) => transformChatDTO(chatDTO));
          dispatch({ chatsList: chats });
        }
      } else {
        dispatch({ loginFormError: 'Неверное имя пользователя или пароль' });
      }
    } catch (e) {
      console.log('login error', e);
    } finally {
      dispatch({ isLoading: false });
    }
  }

  public async signUp(
    dispatch: Dispatch<AppState>,
    userData: SignUpRequest,
  ) {
    try {
      dispatch({ isLoading: true });
      const signUpResponse = await AuthApi.getInstance().signUp(userData);
      if (!apiHasError(signUpResponse)) {
        const loginResponse = await AuthApi.getInstance().signIn({
          login: userData.login,
          password: userData.password,
        });
        if (!apiHasError(loginResponse)) {
          const getCurrentUserResponse = await AuthApi.getInstance().getUserInfo();
          if (!apiHasError(getCurrentUserResponse)) {
            dispatch({ user: transformUserDTO(getCurrentUserResponse) });
          }
          const chatsResponse = await ChatsApi.getInstance().getChats();
          if (!apiHasError(chatsResponse)) {
            const chats = chatsResponse.map((chatDTO) => transformChatDTO(chatDTO));
            dispatch({ chatsList: chats });
          }
          BrowserRouter.getInstance().go(Page.CHAT);
        }
      }
    } catch (e) {
      console.log('signup error', e);
    } finally {
      dispatch({ isLoading: false });
    }
  }

  public async logout() {
    const response = await AuthApi.getInstance().logout();
    if (!apiHasError(response)) {
      BrowserRouter.getInstance().go(Page.LOGIN);
    }
  }
}
