import { ContentType, Header, HTTPTransport } from '../utils';
import {
  BASE_URL,
  USER_PASSWORD,
  USER_PROFILE,
  USER_PROFILE_AVATAR,
  USER_SEARCH,
} from './urls';
import { UserDTO } from '../models/user';
import { APIError } from '../models/error';
import { ChangeUserPasswordRequest, UserRequest, UserSearchRequest } from './api-types';

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
    return this.httpClient.put<UserDTO | APIError>(USER_PROFILE, {
      data,
      headers: {
        [Header.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
    });
  }

  public uploadUserAvatar(avatar: File) {
    const data = new FormData();
    data.append('avatar', avatar);
    return this.httpClient.put<UserDTO | APIError>(USER_PROFILE_AVATAR, {
      data,
      headers: {},
    });
  }

  public changeUserPassword(data: ChangeUserPasswordRequest) {
    return this.httpClient.put<APIError>(USER_PASSWORD, {
      data,
      headers: {
        [Header.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
    });
  }

  public searchUserByLogin(data: UserSearchRequest) {
    return this.httpClient.post<Array<UserDTO> | APIError>(USER_SEARCH, {
      data,
      headers: {
        [Header.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
    });
  }
}
