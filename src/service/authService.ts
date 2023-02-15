import { AuthApi } from '../api';
import { SignInRequest, SignUpRequest } from '../api/api-types';
import { AppState, Dispatch, Page } from '../models/app';
import { BrowserRouter } from '../core';
import { apiHasError } from '../utils/apiHasError';
import { transformUserDTO } from '../models/user';

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
      console.log('resp sign in', signInResponse);
      if (!apiHasError(signInResponse)) {
        BrowserRouter.getInstance().go(Page.CHAT);
        const userInfoResponse = await AuthApi.getInstance().getUserInfo();
        if (!apiHasError(userInfoResponse)) {
          dispatch({ user: transformUserDTO(userInfoResponse) });
        }
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
