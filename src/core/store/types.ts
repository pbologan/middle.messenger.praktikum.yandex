import { Page } from '../router';

export type AppState = {
  page: Page | null;
  isLoading: boolean;
  loginFormError: string | null;
  user: User | null;
};
