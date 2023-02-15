import { AppState, Dispatch, Page } from '../models/app';
import { localStorageUtils } from '../utils/localStorageUtils';
import { BrowserRouter } from '../core';
import { AuthApi } from '../api';
import { apiHasError } from '../utils/apiHasError';
import { transformUserDTO } from '../models/user';

export async function initApp(dispatch: Dispatch<AppState>) {
  const storedPage = localStorageUtils.getCurrentPage();
  if (storedPage) {
    dispatch({ page: storedPage });
  }
  const router = BrowserRouter.getInstance();
  const response = await AuthApi.getInstance().getUserInfo();

  if (apiHasError(response)) {
    router.go(storedPage || Page.LOGIN);
    return;
  }

  dispatch({ user: transformUserDTO(response) });

  router.go(storedPage || Page.CHAT);
}
