import { HTTPTransport } from '../utils/http-transport';
import {
  BASE_URL,
  USER_PASSWORD,
  USER_PROFILE,
  USER_PROFILE_AVATAR,
  USER_SEARCH,
} from './urls';
import { UserDTO } from '../models/user';
import { APIError } from '../models/error';
import { ChangeUserPasswordRequest, UserRequest, UserSearchRequest } from '../models/api-types';

export class UsersApi {
  private static instance: UsersApi | null = null;

  private httpClient: HTTPTransport;

  private constructor() {
    this.httpClient = new HTTPTransport(BASE_URL);
  }

  public static getInstance(): UsersApi {
    if (!UsersApi.instance) {
      UsersApi.instance = new UsersApi();
    }
    return UsersApi.instance;
  }

  public getUserById(id: number) {
    return this.httpClient.get<UserDTO | APIError>(`USER/${id}`);
  }

  public editUser(data: UserRequest) {
    return this.httpClient.put<UserDTO | APIError>(USER_PROFILE, { data });
  }

  public uploadUserAvatar(avatar: File) {
    const data = new FormData();
    data.append('avatar', avatar);
    return this.httpClient.put<UserDTO | APIError>(USER_PROFILE_AVATAR, { data });
  }

  public changeUserPassword(data: ChangeUserPasswordRequest) {
    return this.httpClient.put<APIError>(USER_PASSWORD, { data });
  }

  public searchUserByLogin(data: UserSearchRequest) {
    return this.httpClient.post<UserDTO | APIError>(USER_SEARCH, { data });
  }
}
