import { Page } from '../models/app';

export enum LocalStorageKey {
  CURRENT_PAGE = 'currentPage',
}

export const localStorageUtils = {
  storeCurrentPage: (currentPage: Page) => {
    localStorage.setItem(LocalStorageKey.CURRENT_PAGE, currentPage);
  },
  getCurrentPage: (): Page | null => {
    const storedPage = localStorage.getItem(LocalStorageKey.CURRENT_PAGE);
    return storedPage ? storedPage as Page : null;
  },
};
