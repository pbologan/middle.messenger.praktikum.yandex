import { UsersApi } from '../api';
import { ChangeUserPasswordRequest, UserRequest } from '../api/api-types';
import { apiHasError } from '../utils';
import { AppState, Dispatch } from '../models/app';
import { transformUserDTO } from '../models/user';

export class UsersService {
  private static instance: UsersService | null = null;

  private constructor() {
    if (UsersService.instance) {
      throw new Error('Singleton. Use getInstance method');
    }
  }

  public static getInstance() {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }
    return UsersService.instance;
  }

  public async editUserProfile(
    dispatch: Dispatch<AppState>,
    data: UserRequest,
  ) {
    try {
      dispatch({ isLoading: true });
      const response = await UsersApi.getInstance().editUser(data);
      if (!apiHasError(response)) {
        dispatch({ user: transformUserDTO(response) });
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }

  public async changeUserPassword(
    dispatch: Dispatch<AppState>,
    data: ChangeUserPasswordRequest,
  ) {
    try {
      dispatch({ isLoading: true });
      await UsersApi.getInstance().changeUserPassword(data);
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }

  public async changeUserAvatar(
    dispatch: Dispatch<AppState>,
    file: File,
  ) {
    try {
      dispatch({ isLoading: true });
      const response = await UsersApi.getInstance().uploadUserAvatar(file);
      if (!apiHasError(response)) {
        dispatch({ user: transformUserDTO(response) });
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ isLoading: false });
    }
  }
}
