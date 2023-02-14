import { ContentType, HTTPTransport, Header } from '../utils/http-transport';
import {
  BASE_URL, GET_USER_INFO, LOGOUT, SIGN_IN, SIGN_UP,
} from './urls';
import { APIError } from '../models/error';
import { SignInRequest, SignUpRequest, SignUpResponse } from './api-types';
import { UserDTO } from '../models/user';

export class AuthApi {
  private static instance: AuthApi | null = null;

  private readonly httpClient: HTTPTransport;

  private constructor() {
    this.httpClient = new HTTPTransport(BASE_URL);
  }

  public static getInstance(): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi();
    }
    return AuthApi.instance;
  }

  public signUp(userData: SignUpRequest) {
    return this.httpClient.post<SignUpResponse | APIError>(SIGN_UP, {
      data: userData,
      headers: {
        [Header.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
    });
  }

  public signIn(userData: SignInRequest) {
    return this.httpClient.post<APIError>(SIGN_IN, { data: userData });
  }

  public logout() {
    return this.httpClient.post(LOGOUT);
  }

  public getUserInfo() {
    return this.httpClient.get<UserDTO | APIError>(GET_USER_INFO);
  }
}
